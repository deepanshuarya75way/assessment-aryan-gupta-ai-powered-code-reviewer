export type Chunk = { id: string, filePath: string, text: string };

const RRF_K = 60;

export function extractTerms(text: string, max = 15): string[] {
  const words = text.match(/[A-Za-z_][A-Za-z0-9_.]{3,}/g) ?? [];
  const counts = new Map<string, number>();
  for(const w of words) {
    const codeLike = /[_.]/.test(w) || (/[a-z]/.test(w) && /[A-Z]/.test(w));
    if(!codeLike || /\.(ts|tsx|js|jsx|json|ms|css)$/.test(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a,b) => b[1] - a[1]).slice(0, max).map(([t]) => t);
}

export function fuse(dense: Chunk[], sparse: Chunk[]): Chunk[] {
  const scores = new Map<string, { chunk: Chunk; score: number }> ();
  for (const list of [dense, sparse]) {
    list.forEach((chunk, rank) => {
      const prev = scores.get(chunk.id);
      scores.set(chunk.id, {
        chunk: prev?.chunk ?? chunk,
        score: (prev?.score ?? 0) + 1 / (RRF_K + rank + 1),
      });
    });
  }
  return [...scores.values()].sort((a,b) => b.score - a.score).map((x) => x.chunk);
}

export function dedupe(chunks: Chunk[]): Chunk[] {
  const ids = new Set<string>();
  const texts = new Set<string>();
  return chunks.filter((c) => {
    if(ids.has(c.id) || texts.has(c.text)) return false;
    ids.add(c.id);
    texts.add(c.text);
    return true;
  });
}