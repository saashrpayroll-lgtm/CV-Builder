---------------------------------------------------------
-- V5 Migration: Allow User App to Read Public Settings safely
---------------------------------------------------------

-- Create a secure RPC function that only returns non-sensitive settings
CREATE OR REPLACE FUNCTION public.get_public_settings()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'monetization_enabled', monetization_enabled,
    'export_price_1', export_price_1,
    'export_price_3', export_price_3,
    'payment_upi_qr', payment_upi_qr,
    'export_payment_message', export_payment_message,
    'auto_approve_payments', auto_approve_payments,
    'payment_gateway_key', payment_gateway_key
  )
  FROM public.admin_settings
  LIMIT 1;
$$;
