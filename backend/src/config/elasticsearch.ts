import { Client, Transport } from '@elastic/elasticsearch';
import type { TransportOptions } from '@elastic/transport';

// OpenSearch does not recognise the ES8 vendor Content-Type headers.
// Override them with standard application/json via a custom Transport.
class OpenSearchTransport extends Transport {
  constructor(opts: TransportOptions) {
    super({
      ...opts,
      // OpenSearch: disable product header check and vendor content-type
      productCheck: undefined,
      vendoredHeaders: {
        jsonContentType: 'application/json',
        ndjsonContentType: 'application/x-ndjson',
        accept: 'application/json,text/plain',
      },
    });
  }
}

export const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  Transport: OpenSearchTransport,
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
