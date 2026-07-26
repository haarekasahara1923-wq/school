import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  pgEnum,
  date,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum('user_role', ['admin', 'accountant', 'operations', 'inventory']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'partial', 'overdue']);
export const paymentModeEnum = pgEnum('payment_mode', ['cash', 'online', 'cheque', 'dd']);
export const payrollStatusEnum = pgEnum('payroll_status', ['pending', 'processed', 'paid']);
export const galleryTypeEnum = pgEnum('gallery_type', ['image', 'video']);
export const enquiryStatusEnum = pgEnum('enquiry_status', ['new', 'in_progress', 'resolved', 'closed']);
export const aboutSectionEnum = pgEnum('about_section', ['director', 'principal']);
export const inventoryStatusEnum = pgEnum('inventory_status', ['in_stock', 'low_stock', 'out_of_stock']);

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull().default('operations'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Students ─────────────────────────────────────────────────────────────────
export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  admissionNo: varchar('admission_no', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  class: varchar('class', { length: 20 }).notNull(),
  section: varchar('section', { length: 10 }),
  rollNo: varchar('roll_no', { length: 20 }),
  parentName: varchar('parent_name', { length: 255 }).notNull(),
  parentPhone: varchar('parent_phone', { length: 20 }).notNull(),
  parentEmail: varchar('parent_email', { length: 255 }),
  address: text('address'),
  photoUrl: text('photo_url'),
  photoPublicId: text('photo_public_id'),
  dateOfBirth: date('date_of_birth'),
  gender: varchar('gender', { length: 10 }),
  bloodGroup: varchar('blood_group', { length: 10 }),
  admissionDate: date('admission_date').notNull().defaultNow(),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Fee Structures ────────────────────────────────────────────────────────────
export const feeStructures = pgTable('fee_structures', {
  id: uuid('id').defaultRandom().primaryKey(),
  class: varchar('class', { length: 20 }).notNull(),
  feeType: varchar('fee_type', { length: 100 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: date('due_date'),
  academicYear: varchar('academic_year', { length: 20 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Fee Payments ──────────────────────────────────────────────────────────────
export const feePayments = pgTable('fee_payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').notNull().references(() => students.id),
  feeStructureId: uuid('fee_structure_id').references(() => feeStructures.id),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull(),
  paymentDate: date('payment_date').notNull().defaultNow(),
  paymentMode: paymentModeEnum('payment_mode').notNull().default('cash'),
  receiptNo: varchar('receipt_no', { length: 50 }),
  receiptUrl: text('receipt_url'),
  receiptPublicId: text('receipt_public_id'),
  remarks: text('remarks'),
  status: paymentStatusEnum('status').notNull().default('paid'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Staff ────────────────────────────────────────────────────────────────────
export const staff = pgTable('staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: varchar('employee_id', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  designation: varchar('designation', { length: 255 }).notNull(),
  department: varchar('department', { length: 100 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: text('address'),
  photoUrl: text('photo_url'),
  photoPublicId: text('photo_public_id'),
  joiningDate: date('joining_date').notNull().defaultNow(),
  qualification: varchar('qualification', { length: 255 }),
  experience: integer('experience'),
  basicSalary: decimal('basic_salary', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').notNull().default(true),
  isPublic: boolean('is_public').notNull().default(true),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Payroll ──────────────────────────────────────────────────────────────────
export const payroll = pgTable('payroll', {
  id: uuid('id').defaultRandom().primaryKey(),
  staffId: uuid('staff_id').notNull().references(() => staff.id),
  month: integer('month').notNull(),
  year: integer('year').notNull(),
  basicSalary: decimal('basic_salary', { precision: 10, scale: 2 }).notNull(),
  allowances: decimal('allowances', { precision: 10, scale: 2 }).notNull().default('0'),
  deductions: decimal('deductions', { precision: 10, scale: 2 }).notNull().default('0'),
  netSalary: decimal('net_salary', { precision: 10, scale: 2 }).notNull(),
  status: payrollStatusEnum('status').notNull().default('pending'),
  paidDate: date('paid_date'),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Gallery Albums ────────────────────────────────────────────────────────────
export const galleryAlbums = pgTable('gallery_albums', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  coverUrl: text('cover_url'),
  coverPublicId: text('cover_public_id'),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Gallery Items ─────────────────────────────────────────────────────────────
export const galleryItems = pgTable('gallery_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  albumId: uuid('album_id').notNull().references(() => galleryAlbums.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  publicId: text('public_id').notNull(),
  caption: varchar('caption', { length: 500 }),
  type: galleryTypeEnum('type').notNull().default('image'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Certifications ────────────────────────────────────────────────────────────
export const certifications = pgTable('certifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  publicId: text('public_id').notNull(),
  issuedBy: varchar('issued_by', { length: 255 }),
  issuedDate: date('issued_date'),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Contact Enquiries ─────────────────────────────────────────────────────────
export const contactEnquiries = pgTable('contact_enquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: text('address'),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  status: enquiryStatusEnum('status').notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Admission Enquiries ───────────────────────────────────────────────────────
export const admissionEnquiries = pgTable('admission_enquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentName: varchar('student_name', { length: 255 }).notNull(),
  classApplying: varchar('class_applying', { length: 20 }).notNull(),
  parentName: varchar('parent_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
  address: text('address'),
  message: text('message'),
  status: enquiryStatusEnum('status').notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── About Content ─────────────────────────────────────────────────────────────
export const aboutContent = pgTable('about_content', {
  id: uuid('id').defaultRandom().primaryKey(),
  section: aboutSectionEnum('section').notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  designation: varchar('designation', { length: 255 }).notNull(),
  photoUrl: text('photo_url'),
  photoPublicId: text('photo_public_id'),
  message: text('message').notNull(),
  qualifications: text('qualifications'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Inventory ────────────────────────────────────────────────────────────────
export const inventory = pgTable('inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemName: varchar('item_name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  quantity: integer('quantity').notNull().default(0),
  unit: varchar('unit', { length: 50 }),
  location: varchar('location', { length: 255 }),
  status: inventoryStatusEnum('status').notNull().default('in_stock'),
  minQuantity: integer('min_quantity').notNull().default(10),
  lastRestocked: date('last_restocked'),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const studentsRelations = relations(students, ({ many }) => ({
  feePayments: many(feePayments),
}));

export const feePaymentsRelations = relations(feePayments, ({ one }) => ({
  student: one(students, { fields: [feePayments.studentId], references: [students.id] }),
  feeStructure: one(feeStructures, { fields: [feePayments.feeStructureId], references: [feeStructures.id] }),
}));

export const staffRelations = relations(staff, ({ many }) => ({
  payroll: many(payroll),
}));

export const payrollRelations = relations(payroll, ({ one }) => ({
  staff: one(staff, { fields: [payroll.staffId], references: [staff.id] }),
}));

export const galleryAlbumsRelations = relations(galleryAlbums, ({ many }) => ({
  items: many(galleryItems),
}));

export const galleryItemsRelations = relations(galleryItems, ({ one }) => ({
  album: one(galleryAlbums, { fields: [galleryItems.albumId], references: [galleryAlbums.id] }),
}));
