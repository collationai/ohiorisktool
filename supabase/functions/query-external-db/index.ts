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

    console.log('Connecting to external database...');
    
    // Create database pool
    const pool = new postgres.Pool({
      hostname: Deno.env.get('EXTERNAL_DB_HOST'),
      port: parseInt(Deno.env.get('EXTERNAL_DB_PORT') || '5432'),
      database: Deno.env.get('EXTERNAL_DB_NAME'),
      user: Deno.env.get('EXTERNAL_DB_USER'),
      password: Deno.env.get('EXTERNAL_DB_PASSWORD'),
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
