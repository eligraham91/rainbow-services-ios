import React from 'react';
import { DecoderEngine } from '@components/ui/DecoderEngine';
import { FIN_DECODER_EXAMPLES } from '@data/finDecoder';

export default function FinancialScreen() {
  return (
    <DecoderEngine
      eyebrow="Decipher · Financial"
      title={"Money as\ncontrol."}
      examples={FIN_DECODER_EXAMPLES}
    />
  );
}
