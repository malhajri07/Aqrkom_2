-- Phase 1 PRD Extensions: earnest_money, REGA validation support
-- TM-009: Earnest Money / Deposit Tracking

CREATE TABLE IF NOT EXISTS earnest_money (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  payment_date DATE NOT NULL,
  holder VARCHAR(255), -- who holds the deposit (broker, escrow, etc.)
  refund_conditions TEXT,
  status VARCHAR(20) DEFAULT 'held', -- held, refunded, applied_to_purchase
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_earnest_money_transaction ON earnest_money(transaction_id);
