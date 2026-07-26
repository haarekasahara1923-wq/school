import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Contact Enquiry ──────────────────────────────────────────────────────────
export const contactEnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20),
  address: z.string().max(500).optional(),
  subject: z.string().max(255).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

// ─── Admission Enquiry ────────────────────────────────────────────────────────
export const admissionEnquirySchema = z.object({
  studentName: z.string().min(2).max(255),
  classApplying: z.string().min(1, 'Please select a class'),
  parentName: z.string().min(2).max(255),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(500).optional(),
  message: z.string().max(1000).optional(),
});

// ─── Student ──────────────────────────────────────────────────────────────────
export const studentSchema = z.object({
  admissionNo: z.string().min(1).max(50),
  name: z.string().min(2).max(255),
  class: z.string().min(1).max(20),
  section: z.string().max(10).optional(),
  rollNo: z.string().max(20).optional(),
  parentName: z.string().min(2).max(255),
  parentPhone: z.string().min(10).max(20),
  parentEmail: z.string().email().optional().or(z.literal('')),
  address: z.string().max(500).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  bloodGroup: z.string().max(10).optional(),
  admissionDate: z.string().optional(),
});

// ─── Staff ────────────────────────────────────────────────────────────────────
export const staffSchema = z.object({
  employeeId: z.string().min(1).max(50),
  name: z.string().min(2).max(255),
  designation: z.string().min(1).max(255),
  department: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10).max(20),
  address: z.string().max(500).optional(),
  joiningDate: z.string(),
  qualification: z.string().max(255).optional(),
  experience: z.number().int().min(0).optional(),
  basicSalary: z.string().optional(),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true),
});

// ─── Fee Structure ────────────────────────────────────────────────────────────
export const feeStructureSchema = z.object({
  class: z.string().min(1).max(20),
  feeType: z.string().min(1).max(100),
  amount: z.string().min(1),
  dueDate: z.string().optional(),
  academicYear: z.string().min(1).max(20),
  description: z.string().max(500).optional(),
});

// ─── Fee Payment ──────────────────────────────────────────────────────────────
export const feePaymentSchema = z.object({
  studentId: z.string().uuid(),
  feeStructureId: z.string().uuid().optional(),
  amountPaid: z.string().min(1),
  paymentDate: z.string(),
  paymentMode: z.enum(['cash', 'online', 'cheque', 'dd']),
  receiptNo: z.string().max(50).optional(),
  remarks: z.string().max(500).optional(),
});

// ─── Gallery Album ────────────────────────────────────────────────────────────
export const galleryAlbumSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  isPublished: z.boolean().default(false),
});

// ─── Certification ────────────────────────────────────────────────────────────
export const certificationSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  issuedBy: z.string().max(255).optional(),
  issuedDate: z.string().optional(),
  isPublished: z.boolean().default(true),
});

// ─── About Content ────────────────────────────────────────────────────────────
export const aboutContentSchema = z.object({
  section: z.enum(['director', 'principal']),
  name: z.string().min(1).max(255),
  designation: z.string().min(1).max(255),
  message: z.string().min(10),
  qualifications: z.string().max(500).optional(),
});

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settingsSchema = z.object({
  schoolName: z.string().min(1).max(255),
  address: z.string().min(1),
  phone: z.string().min(10).max(20),
  email: z.string().email(),
  whatsappNumber: z.string().min(10).max(20),
  website: z.string().url().optional().or(z.literal('')),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>;
export type AdmissionEnquiryInput = z.infer<typeof admissionEnquirySchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type StaffInput = z.infer<typeof staffSchema>;
export type FeeStructureInput = z.infer<typeof feeStructureSchema>;
export type FeePaymentInput = z.infer<typeof feePaymentSchema>;
export type GalleryAlbumInput = z.infer<typeof galleryAlbumSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type AboutContentInput = z.infer<typeof aboutContentSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
