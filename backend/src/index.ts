import app from './app';
import { createJobIndex } from './config/elasticsearch';

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  createJobIndex().catch(err => console.error('ES index init failed:', err.message));
});
