import { PrismaClient, JobType, JobStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Production seed — populates the (Neon) database with a realistic set of
 * full-stack job listings for the demo job board.
 *
 * Run with the target DATABASE_URL provided via the environment, e.g.:
 *   DATABASE_URL="postgresql://..." npx ts-node prisma/seedProduction.ts
 *
 * The script is idempotent: users are upserted by email, companies by their
 * (unique) ownerId, and a job is only created if one with the same title does
 * not already exist for that company.
 *
 * Schema notes:
 *  - The JobType enum has no HYBRID/REMOTE value, so every role is FULL_TIME and
 *    the remote/hybrid distinction is carried by the `remote` boolean.
 *  - companies.ownerId is unique (one company per user), so each company is
 *    given its own employer account. employer@demo.com is the primary demo
 *    login and owns the first company.
 */

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Demo1234!';

interface SeedEntry {
  company: string;
  owner: { email: string; firstName: string; lastName: string };
  job: {
    title: string;
    location: string;
    description: string;
    requirements: string[];
    skills: string[];
    salaryMin: number;
    salaryMax: number;
    remote: boolean;
  };
}

const SEED: SeedEntry[] = [
  {
    company: 'Oliver Bernard',
    owner: { email: 'employer@demo.com', firstName: 'Demo', lastName: 'Employer' },
    job: {
      title: 'Senior Full Stack Engineer',
      location: 'London, UK',
      description:
        "We are a leading FinTech recruitment firm building internal tooling to match candidates with roles at speed. We're looking for a Senior Full Stack Engineer to join our product team. You'll work across the full stack building features in TypeScript, React, and Node.js with NestJS. Our stack includes PostgreSQL, Redis, and AWS. You'll be involved in architecture decisions, code reviews, and mentoring junior developers. We value clean code, test coverage, and shipping fast without breaking things.",
      requirements: [
        '5+ years full stack experience',
        'TypeScript',
        'React',
        'Node.js/NestJS',
        'PostgreSQL',
        'AWS',
        'REST APIs',
        'Git',
      ],
      skills: ['TypeScript', 'React', 'Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'AWS', 'REST APIs', 'Git'],
      salaryMin: 90000,
      salaryMax: 120000,
      remote: false,
    },
  },
  {
    company: 'Gamma',
    owner: { email: 'hiring@gamma.demo', firstName: 'Gamma', lastName: 'Hiring' },
    job: {
      title: 'Senior Software Engineer — Node.js/TypeScript',
      location: 'Manchester, UK',
      description:
        "Gamma is a leading UCaaS provider delivering communication solutions to businesses across the UK and Europe. We're growing our engineering team and looking for a Senior Software Engineer with strong Node.js and TypeScript skills. You'll work on our cloud communications platform, building scalable microservices, RESTful APIs, and integrating with third-party telephony providers. We use React on the frontend and run on AWS infrastructure. You'll collaborate with product managers, designers, and QA engineers in cross-functional squads.",
      requirements: [
        '4+ years backend experience',
        'Node.js',
        'TypeScript',
        'React',
        'microservices',
        'REST APIs',
        'AWS',
        'PostgreSQL or MySQL',
      ],
      skills: ['Node.js', 'TypeScript', 'React', 'Microservices', 'REST APIs', 'AWS', 'PostgreSQL', 'MySQL'],
      salaryMin: 85000,
      salaryMax: 105000,
      remote: false,
    },
  },
  {
    company: 'Ashby',
    owner: { email: 'hiring@ashby.demo', firstName: 'Ashby', lastName: 'Hiring' },
    job: {
      title: 'Senior Full Stack Engineer — Remote',
      location: 'Remote, UK',
      description:
        "Ashby is a B2B SaaS company building the next generation of recruiting software. We help talent teams at companies like Notion, Figma, and Deel hire better and faster. As a Senior Full Stack Engineer you'll work on our core product, building features end-to-end from database schema to React UI. Our stack is TypeScript throughout — Node.js and GraphQL on the backend, React on the frontend, PostgreSQL as our primary database. We ship continuously and care deeply about code quality, developer experience, and product craft.",
      requirements: [
        '5+ years full stack',
        'TypeScript',
        'React',
        'Node.js',
        'GraphQL',
        'PostgreSQL',
        'strong product instincts',
        'remote-first mindset',
      ],
      skills: ['TypeScript', 'React', 'Node.js', 'GraphQL', 'PostgreSQL'],
      salaryMin: 103000,
      salaryMax: 137000,
      remote: true,
    },
  },
  {
    company: 'Harnham',
    owner: { email: 'hiring@harnham.demo', firstName: 'Harnham', lastName: 'Hiring' },
    job: {
      title: 'Full Stack Engineer — Node.js/React',
      location: 'London, UK',
      description:
        "Harnham is a specialist data and analytics recruitment firm. We're building out our internal platform and candidate-facing products. We're looking for a Full Stack Engineer to join a small, high-ownership product team. You'll be working with Node.js on the backend, React and Next.js on the frontend, and PostgreSQL as the database. The role involves building new features, improving performance, and working closely with the business to understand user needs.",
      requirements: [
        '3+ years full stack',
        'Node.js',
        'React',
        'Next.js',
        'PostgreSQL',
        'REST APIs',
        'TypeScript preferred',
      ],
      skills: ['Node.js', 'React', 'Next.js', 'PostgreSQL', 'REST APIs', 'TypeScript'],
      salaryMin: 80000,
      salaryMax: 90000,
      remote: false,
    },
  },
  {
    company: 'Haystack',
    owner: { email: 'hiring@haystack.demo', firstName: 'Haystack', lastName: 'Hiring' },
    job: {
      title: 'Senior Full Stack Developer — TypeScript/Node.js',
      location: 'Remote, UK',
      description:
        "Haystack is a business services platform helping SMEs manage their operations more efficiently. We're a remote-first engineering team that cares about autonomy, async communication, and shipping quality software. As a Senior Full Stack Developer you'll own features end-to-end, working across our Node.js/TypeScript backend and React frontend. We use PostgreSQL, run on AWS, and deploy via CI/CD pipelines. You'll work directly with the CTO and product team in a flat structure with real influence over technical decisions.",
      requirements: [
        '4+ years full stack',
        'Node.js',
        'TypeScript',
        'React',
        'PostgreSQL',
        'AWS',
        'CI/CD',
        'comfortable working remotely and async',
      ],
      skills: ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'AWS', 'CI/CD'],
      salaryMin: 70000,
      salaryMax: 84000,
      remote: true,
    },
  },
  {
    company: 'Monzo',
    owner: { email: 'hiring@monzo.demo', firstName: 'Monzo', lastName: 'Hiring' },
    job: {
      title: 'Backend Engineer — Node.js/TypeScript',
      location: 'London, UK',
      description:
        "Monzo is one of the UK's leading digital banks with over 9 million customers. Our engineering culture is built on autonomy, transparency, and making banking better for everyone. We're looking for a Backend Engineer to join one of our product squads. You'll build and maintain microservices in Node.js and TypeScript, work with distributed systems, and contribute to a codebase that processes millions of transactions daily. We use PostgreSQL, Kafka, and run on AWS.",
      requirements: [
        '4+ years backend',
        'Node.js',
        'TypeScript',
        'microservices',
        'distributed systems',
        'PostgreSQL',
        'Kafka or similar message queue',
        'AWS',
      ],
      skills: ['Node.js', 'TypeScript', 'Microservices', 'Distributed Systems', 'PostgreSQL', 'Kafka', 'AWS'],
      salaryMin: 95000,
      salaryMax: 125000,
      remote: false,
    },
  },
  {
    company: 'DAZN',
    owner: { email: 'hiring@dazn.demo', firstName: 'DAZN', lastName: 'Hiring' },
    job: {
      title: 'Full Stack Engineer — Angular/Node.js',
      location: 'Leeds, UK',
      description:
        "DAZN is the world's leading live sports streaming platform. We're hiring a Full Stack Engineer to work on our content management and publishing tools. You'll build features using Angular on the frontend and Node.js/TypeScript on the backend, working with a global team across multiple time zones. Our platform serves millions of sports fans worldwide and engineering quality is critical. We value pragmatic engineering, clear communication, and a passion for sport.",
      requirements: [
        '4+ years full stack',
        'Angular',
        'Node.js',
        'TypeScript',
        'REST APIs',
        'PostgreSQL or MongoDB',
        'CI/CD',
        'experience with media or streaming platforms a bonus',
      ],
      skills: ['Angular', 'Node.js', 'TypeScript', 'REST APIs', 'PostgreSQL', 'MongoDB', 'CI/CD'],
      salaryMin: 80000,
      salaryMax: 100000,
      remote: false,
    },
  },
  {
    company: 'Farewill',
    owner: { email: 'hiring@farewill.demo', firstName: 'Farewill', lastName: 'Hiring' },
    job: {
      title: 'Senior Engineer — React/Node.js',
      location: 'Remote, UK',
      description:
        "Farewill is on a mission to change the way the world deals with death — making wills, probate, and funerals simpler and more affordable. We're a small, mission-driven engineering team building products that genuinely help people. As a Senior Engineer you'll work across our React frontend and Node.js backend, own features end-to-end, and help shape our technical direction. We're fully remote, ship continuously, and care deeply about doing meaningful work well.",
      requirements: [
        '4+ years full stack',
        'React',
        'Node.js',
        'TypeScript',
        'PostgreSQL',
        'strong ownership mindset',
        'comfortable in a small team',
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      salaryMin: 85000,
      salaryMax: 105000,
      remote: true,
    },
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  let jobsCreated = 0;
  let jobsSkipped = 0;

  for (const entry of SEED) {
    const user = await prisma.user.upsert({
      where: { email: entry.owner.email },
      update: {},
      create: {
        email: entry.owner.email,
        password: hashedPassword,
        firstName: entry.owner.firstName,
        lastName: entry.owner.lastName,
        role: Role.EMPLOYER,
      },
    });

    const company = await prisma.company.upsert({
      where: { ownerId: user.id },
      update: {},
      create: {
        name: entry.company,
        location: entry.job.location,
        description: `${entry.company} — hiring engineers on the demo job board.`,
        ownerId: user.id,
      },
    });

    const existing = await prisma.job.findFirst({
      where: { title: entry.job.title, companyId: company.id },
    });

    if (existing) {
      jobsSkipped += 1;
      continue;
    }

    await prisma.job.create({
      data: {
        title: entry.job.title,
        description: entry.job.description,
        requirements: entry.job.requirements,
        skills: entry.job.skills,
        location: entry.job.location,
        remote: entry.job.remote,
        salaryMin: entry.job.salaryMin,
        salaryMax: entry.job.salaryMax,
        currency: 'GBP',
        type: JobType.FULL_TIME,
        status: JobStatus.ACTIVE,
        companyId: company.id,
      },
    });
    jobsCreated += 1;
  }

  const [users, companies, jobs] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.job.count(),
  ]);

  console.log(`✅ Seed complete — jobs created: ${jobsCreated}, skipped (already present): ${jobsSkipped}`);
  console.log(`📊 Totals — users: ${users}, companies: ${companies}, jobs: ${jobs}`);
  console.log(`🔑 Primary demo login: employer@demo.com / ${DEMO_PASSWORD}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error('❌ Seed failed:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
