import React from 'react';
import { DecoderEngine } from '@components/ui/DecoderEngine';
import { DECODER_EXAMPLES } from '@data/decoder';

export default function TextThreadScreen() {
  return (
    <DecoderEngine
      eyebrow="Decipher · Text Thread"
      title={"Patterns in\nthe messages."}
      examples={DECODER_EXAMPLES}
    />
  );
}
