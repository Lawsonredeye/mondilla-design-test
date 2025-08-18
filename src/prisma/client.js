// import pkg from '';
// const { PrismaClient } = pkg;

import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export default prisma;
