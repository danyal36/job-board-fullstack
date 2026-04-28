import { Client } from '@elastic/elasticsearch';

export const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

export const JOB_INDEX = 'jobs';

export const createJobIndex = async () => {
  const exists = await elasticClient.indices.exists({ index: JOB_INDEX });

  if (!exists) {
    await elasticClient.indices.create({
      index: JOB_INDEX,
      mappings: {
        properties: {
          id: { type: 'keyword' },
          title: {
            type: 'text',
            fields: { keyword: { type: 'keyword' } },
          },
          description: { type: 'text' },
          requirements: { type: 'text' },
          skills: { type: 'keyword' },
          location: {
            type: 'text',
            fields: { keyword: { type: 'keyword' } },
          },
          remote: { type: 'boolean' },
          salaryMin: { type: 'integer' },
          salaryMax: { type: 'integer' },
          currency: { type: 'keyword' },
          type: { type: 'keyword' },
          status: { type: 'keyword' },
          companyId: { type: 'keyword' },
          companyName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
          createdAt: { type: 'date' },
        },
      },
    });
    console.log(`✅ Elasticsearch index "${JOB_INDEX}" created`);
  }
};
