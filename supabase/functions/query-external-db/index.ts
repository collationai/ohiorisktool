import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import * as postgres from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, params } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const host = Deno.env.get('EXTERNAL_DB_HOST');
    const port = Deno.env.get('EXTERNAL_DB_PORT') || '5432';
    const database = Deno.env.get('EXTERNAL_DB_NAME');
    const user = Deno.env.get('EXTERNAL_DB_USER');
    
    console.log('Connecting to external database:', { 
      host, 
      port, 
      database, 
      user,
      hasPassword: !!Deno.env.get('EXTERNAL_DB_PASSWORD')
    });
    
    // Create database pool with SSL support
    const pool = new postgres.Pool({
      hostname: host,
      port: parseInt(port),
      database: database,
      user: user,
      password: Deno.env.get('EXTERNAL_DB_PASSWORD'),
      tls: {
        enabled: true,
        enforce: false,
        caCertificates: [],
      },
      connection: {
        attempts: 1,
      },
    }, 3);

    const connection = await pool.connect();
    
    try {
      console.log('Executing query:', query);
      const result = await connection.queryObject(query, params || []);
      
      console.log('Query executed successfully, rows:', result.rows.length);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          data: result.rows,
          rowCount: result.rows.length 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } finally {
      connection.release();
      await pool.end();
    }

  } catch (error) {
    console.error('Error in query-external-db function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
