"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Landmark,
  Building,
  GraduationCap,
  Code2,
  Layers,
  Calendar,
  Award,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Lock
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { useAssessment } from "@/context/AssessmentContext";
import { candidateService } from "@/services/candidateService";

export default function RegisterPage() {
  const router = useRouter();
  const { candidateInfo, setCandidateInfo } = useAssessment();

  const getNextSequentialEnrollNumber = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ess_enroll_sequence");
      const current = stored ? parseInt(stored, 10) : 101;
      return String(current).padStart(6, "0");
    }
    return "000101";
  };

  const [form, setForm] = useState({
    fullName: candidateInfo.fullName || "",
    email: candidateInfo.email || "",
    phone: candidateInfo.phone || "",
    enrollmentNumber: candidateInfo.enrollmentNumber || "000101",
    college: candidateInfo.college || "",
    university: candidateInfo.university || "",
    degree: candidateInfo.degree || "",
    branch: candidateInfo.branch || "",
    semester: candidateInfo.semester || "",
    graduationYear: candidateInfo.graduationYear || "",
    cgpa: candidateInfo.cgpa || "",
    candidateId: candidateInfo.candidateId || `ESS-${Math.floor(100000 + Math.random() * 900000)}`
  });

  useEffect(() => {
    if (!candidateInfo.enrollmentNumber) {
      candidateService.getNextEnrollmentNumber().then((res) => {
        if (res.success && res.data?.enrollmentNumber) {
          setForm((prev) => ({ ...prev, enrollmentNumber: res.data.enrollmentNumber }));
        } else {
          const autoSeq = getNextSequentialEnrollNumber();
          setForm((prev) => ({ ...prev, enrollmentNumber: autoSeq }));
        }
      }).catch(() => {
        const autoSeq = getNextSequentialEnrollNumber();
        setForm((prev) => ({ ...prev, enrollmentNumber: autoSeq }));
      });
    }
  }, [candidateInfo.enrollmentNumber]);

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    let processedValue = value;
    
    // Strict restriction: Phone number only accepts numbers and maximum 10 digits
    if (field === "phone") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};

    // Full Name
    if (!form.fullName.trim()) {
      errs.fullName = "Full name is required";
    } else if (form.fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(form.fullName.trim())) {
      errs.fullName = "Full name can only contain letters and spaces";
    }

    // ESS Enrollment Number
    if (!form.enrollmentNumber.trim()) {
      errs.enrollmentNumber = "ESS Enrollment Number is required";
    }

    // Email
    if (!form.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) {
      errs.email = "Please enter a valid email address (e.g. name@domain.com)";
    }

    // Phone Number (Strictly exactly 10 digits)
    const rawDigits = form.phone.replace(/\D/g, "");
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (rawDigits.length !== 10) {
      errs.phone = "Phone number must be exactly 10 digits";
    } else if (!/^[6-9]\d{9}$/.test(rawDigits)) {
      errs.phone = "Please enter a valid 10-digit mobile number";
    }

    // Academic Details
    if (!form.college.trim()) errs.college = "College / Institute name is required";
    if (!form.university.trim()) errs.university = "University / Board is required";
    if (!form.degree) errs.degree = "Please select your degree";
    if (!form.branch) errs.branch = "Please select your branch";
    if (!form.semester) errs.semester = "Please select your semester";
    if (!form.graduationYear) errs.graduationYear = "Please select graduation year";

    // CGPA Validation (if filled)
    if (form.cgpa && form.cgpa.trim()) {
      const numCgpa = parseFloat(form.cgpa.replace(/[^0-9.]/g, ""));
      if (isNaN(numCgpa) || numCgpa < 0 || numCgpa > 100) {
        errs.cgpa = "Please enter a valid CGPA (0-10) or Percentage (0-100)";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Advance sequence in localStorage for next registration (000101 -> 000102 -> 000103...)
    if (typeof window !== "undefined") {
      const currentSeq = parseInt(form.enrollmentNumber, 10) || 101;
      localStorage.setItem("ess_enroll_sequence", String(currentSeq + 1));
    }

    try {
      const res = await candidateService.register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        enrollmentNumber: form.enrollmentNumber,
        collegeName: form.college,
        university: form.university,
        degree: form.degree,
        branch: form.branch,
        semester: form.semester,
        graduationYear: form.graduationYear,
        cgpa: form.cgpa
      });

      const backendData = res?.data || {};
      const updatedProfile = {
        ...form,
        id: backendData.id || form.id,
        candidateId: backendData.candidateId || form.candidateId
      };
      setCandidateInfo(updatedProfile);
    } catch (err) {
      console.warn("Registered in local state:", err);
      setCandidateInfo(form);
    }

    router.push("/instructions");
  };

  return (
    <main className="min-h-screen bg-light-mesh flex items-center justify-center p-4 sm:p-6 lg:p-10 relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-6xl rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_70px_rgba(0,0,0,0.07)] overflow-hidden grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Top subtle sheen */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 pointer-events-none" />

        {/* LEFT COLUMN: Candidate Registration Form with All Sections */}
        <div className="lg:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
          <div>
            {/* Header with Navigation */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
              <Logo size="small" />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Link>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: PERSONAL INFORMATION */}
              <div>
                <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-none">
                      Personal Information
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Tell us about yourself.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Full Name & ESS Enrollment Number Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={form.fullName}
                          onChange={(e) => handleChange("fullName", e.target.value)}
                          placeholder="Enter your full name"
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
                            errors.fullName
                              ? "border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900"
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <span className="text-[11px] text-red-600 mt-1 block font-medium">{errors.fullName}</span>
                      )}
                    </div>

                    {/* ESS Enrollment Number (System Auto-Generated & Read-Only) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          ESS Enroll No. <span className="text-slate-400 font-normal text-[10px]">(System Generated)</span>
                        </label>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          <Lock className="w-3 h-3 text-slate-500" />
                          Locked
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={form.enrollmentNumber || "000101"}
                          className="w-full pl-10 pr-10 py-3 bg-slate-100/90 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 cursor-not-allowed select-none outline-none shadow-xs"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                        System automatically assigns sequential ID (000101, 000102...)
                      </span>
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="yourname@college.edu"
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
                            errors.email
                              ? "border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <span className="text-[11px] text-red-600 mt-1 block font-medium">{errors.email}</span>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-[10px] font-mono font-bold ${form.phone.length === 10 ? "text-emerald-600" : "text-slate-400"}`}>
                          {form.phone.length}/10 digits
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          value={form.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 outline-none transition-all ${
                            errors.phone
                              ? "border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900"
                          }`}
                        />
                      </div>
                      {errors.phone ? (
                        <span className="text-[11px] text-red-600 mt-1 block font-medium">{errors.phone}</span>
                      ) : (
                        <span className="text-[10px] text-slate-500 mt-1 block font-medium">Only 10 numeric digits allowed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ACADEMIC INFORMATION */}
              <div>
                <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-none">
                      Academic Information
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Provide your current academic details.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* College / Institute & University Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* College / Institute Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        College / Institute Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={form.college}
                          onChange={(e) => handleChange("college", e.target.value)}
                          placeholder="Enter your college name"
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
                            errors.college
                              ? "border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900"
                          }`}
                        />
                      </div>
                      {errors.college && (
                        <span className="text-[11px] text-red-600 mt-1 block font-medium">{errors.college}</span>
                      )}
                    </div>

                    {/* University / Board */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        University / Board <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Building className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={form.university}
                          onChange={(e) => handleChange("university", e.target.value)}
                          placeholder="Enter your university name"
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all ${
                            errors.university
                              ? "border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900"
                          }`}
                        />
                      </div>
                      {errors.university && (
                        <span className="text-[11px] text-red-600 mt-1 block font-medium">{errors.university}</span>
                      )}
                    </div>
                  </div>

                  {/* Degree & Branch Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Degree / Program */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Degree / Program <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <select
                          required
                          value={form.degree}
                          onChange={(e) => handleChange("degree", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 outline-none appearance-none cursor-pointer transition-all ${
                            errors.degree
                              ? "border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900"
                          }`}
                        >
                          <option value="">Select your degree</option>
                          <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                          <option value="BCA">BCA</option>
                          <option value="B.Sc (CS/IT)">B.Sc (CS/IT)</option>
                          <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                          <option value="MCA">MCA</option>
                          <option value="M.Sc (CS/IT)">M.Sc (CS/IT)</option>
                          <option value="Other Degree">Other Degree</option>
                        </select>
                      </div>
                      {errors.degree && (
                        <span className="text-[11px] text-red-600 mt-1 block font-medium">{errors.degree}</span>
                      )}
                    </div>

                    {/* Branch / Specialization */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Branch / Specialization <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <select
                          required
                          value={form.branch}
                          onChange={(e) => handleChange("branch", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 outline-none appearance-none cursor-pointer transition-all ${
                            errors.branch
                              ? "border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900"
                          }`}
                        >
                          <option value="">Select your branch</option>
                          <option value="Computer Science & Engineering (CSE)">Computer Science & Engineering (CSE)</option>
                          <option value="Information Technology (IT)">Information Technology (IT)</option>
                          <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                          <option value="Data Science & AI">Data Science & AI</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Other Specialization">Other Specialization</option>
                        </select>
                      </div>
                      {errors.branch && (
                        <span className="text-[11px] text-red-600 mt-1 block font-medium">{errors.branch}</span>
                      )}
                    </div>
                  </div>

                  {/* Current Semester & Expected Graduation Year Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Current Semester */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Current Semester <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Layers className="w-4 h-4" />
                        </div>
                        <select
                          required
                          value={form.semester}
                          onChange={(e) => handleChange("semester", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 outline-none appearance-none cursor-pointer transition-all ${
                            errors.semester
                              ? "border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900"
                          }`}
                        >
                          <option value="">Select semester</option>
                          <option value="Semester 1">Semester 1</option>
                          <option value="Semester 2">Semester 2</option>
                          <option value="Semester 3">Semester 3</option>
                          <option value="Semester 4">Semester 4</option>
                          <option value="Semester 5">Semester 5</option>
                          <option value="Semester 6">Semester 6</option>
                          <option value="Semester 7">Semester 7</option>
                          <option value="Semester 8">Semester 8</option>
                          <option value="Graduated / Passout">Graduated / Passout</option>
                        </select>
                      </div>
                      {errors.semester && (
                        <span className="text-[11px] text-red-600 mt-1 block font-medium">{errors.semester}</span>
                      )}
                    </div>

                    {/* Expected Graduation Year */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Expected Graduation Year <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <select
                          required
                          value={form.graduationYear}
                          onChange={(e) => handleChange("graduationYear", e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 outline-none appearance-none cursor-pointer transition-all ${
                            errors.graduationYear
                              ? "border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900"
                          }`}
                        >
                          <option value="">Select year</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                          <option value="2029">2029</option>
                        </select>
                      </div>
                      {errors.graduationYear && (
                        <span className="text-[11px] text-red-600 mt-1 block font-medium">{errors.graduationYear}</span>
                      )}
                    </div>
                  </div>

                  {/* Current CGPA / Percentage (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Current CGPA / Percentage <span className="text-slate-400 font-normal text-[11px] lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Award className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={form.cgpa}
                        onChange={(e) => handleChange("cgpa", e.target.value)}
                        placeholder="e.g. 8.5 CGPA or 85%"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full group bg-slate-900 hover:bg-black text-white"
                  iconRight={ArrowRight}
                >
                  Save & Proceed to Instructions
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Pre-test Summary & Integrity Notice */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-[#0F1420] to-black text-white p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-6">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Assessment Protocol</span>
            </div>

            <h2 className="text-xl font-bold text-white mb-3">
              Assessment Summary
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              You are registering for Emperor Smart Solutions technical evaluation and pre-employment assessment session.
            </p>

            {/* Overview bullets */}
            <div className="space-y-3.5 mb-8">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">15 Questions Total</div>
                  <div className="text-[11px] text-slate-300">5 Math, 5 Logic, 5 Technical</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">1 Minute per Question</div>
                  <div className="text-[11px] text-slate-300">Auto-advances upon timeout</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Word Typing Test</div>
                  <div className="text-[11px] text-slate-300">60s speed & accuracy check</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.08] border border-white/10 text-[11px] text-slate-300">
            Please ensure your educational credentials match your resume.
          </div>
        </div>
      </motion.div>
    </main>
  );
}
