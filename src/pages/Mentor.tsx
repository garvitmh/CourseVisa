import { useState } from 'react';
import { useFormValidation } from '../hooks';
import { FORM_VALIDATION_RULES } from '../constants';
import { api } from '../services/api';
import { Button, Card, CardBody, Input } from '../components/shared';

export default function Mentor() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation<any>(
      {
        name: '',
        email: '',
        phone: '',
        expertise: '',
        experience: '',
        qualifications: '',
        bio: '',
        linkedinUrl: '',
        resume: null,
      },
      FORM_VALIDATION_RULES.mentor as any,
      handleMentorSubmit
    );

  async function handleMentorSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
             formData.append(key, value);
          } else {
             formData.append(key, String(value));
          }
        }
      });

      const res = await api.mentor.apply(formData as any);
      
      if (res.success) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Application failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange({
      target: { name: 'resume', value: file },
    } as any);
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-base-200/50 relative z-10">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">Application Submitted!</h1>
        <p className="text-base-content/80 text-xl max-w-2xl leading-relaxed">
          Thank you for your interest in becoming a mentor at Coursiva.
          Our team will review your application and get back to you within 5-7 business days.
        </p>
        <Button variant="primary" size="lg" className="mt-10 shadow-lg hover:shadow-xl transition-all" onClick={() => window.location.reload()}>
          Submit another application
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 relative z-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-focus text-primary-content text-center py-16 px-8 mb-12 rounded-b-[3rem] shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Join Coursiva as a Mentor</h1>
        <p className="text-primary-content/90 text-xl max-w-2xl mx-auto">
          Share your knowledge, inspire students worldwide, and build your personal brand with our platform.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <Card className="shadow-2xl border border-base-200 bg-base-100 overflow-hidden rounded-2xl">
          <div className="bg-base-200/50 p-8 border-b border-base-200">
            <h2 className="m-0 text-3xl font-bold text-base-content">Application Form</h2>
            <p className="m-0 mt-2 text-base-content/70 text-lg">
              Tell us about yourself and your expertise.
            </p>
          </div>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit}>
              {submitError && (
                <div className="alert alert-error shadow-lg mb-6">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span><strong>Error:</strong> {submitError}</span>
                  </div>
                </div>
              )}
              <div className="grid gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="mb-4 text-primary font-bold text-xl border-b border-base-200 pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name ? errors.name : undefined}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email ? errors.email : undefined}
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone ? errors.phone : undefined}
                      required
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="mb-4 text-primary font-bold text-xl border-b border-base-200 pb-2">Professional Information</h3>
                  <div className="grid gap-4">
                    <Input
                      label="Areas of Expertise"
                      placeholder="e.g., Web Development, Data Science, Mathematics"
                      name="expertise"
                      value={values.expertise}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.expertise ? errors.expertise : undefined}
                      required
                    />
                    <Input
                      label="Years of Experience"
                      type="number"
                      name="experience"
                      value={values.experience}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.experience ? errors.experience : undefined}
                      required
                    />
                    <Input
                      label="Qualifications"
                      placeholder="e.g., Master's in CS, PhD in Physics"
                      name="qualifications"
                      value={values.qualifications}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.qualifications ? errors.qualifications : undefined}
                      required
                    />
                    <Input
                      label="LinkedIn Profile URL"
                      type="url"
                      name="linkedinUrl"
                      value={values.linkedinUrl}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.linkedinUrl ? errors.linkedinUrl : undefined}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="mb-4 text-primary font-bold text-xl border-b border-base-200 pb-2">About You</h3>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-base-content">Professional Bio</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your teaching experience, achievements, and why you'd like to be a mentor..."
                      name="bio"
                      value={values.bio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`textarea textarea-bordered w-full text-base focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${touched.bio && errors.bio ? 'textarea-error' : ''}`}
                      required
                    />
                    {touched.bio && errors.bio && (
                      <span className="text-error text-sm">{errors.bio}</span>
                    )}
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <h3 className="mb-4 text-primary font-bold text-xl border-b border-base-200 pb-2">Resume/Portfolio</h3>
                  <div className="border-2 border-dashed border-base-300 rounded-xl p-8 text-center hover:bg-base-200/50 transition-colors bg-base-200/20">
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label htmlFor="resume" className="cursor-pointer block touch-manipulation">
                      <div className="text-5xl mb-3 drop-shadow-sm">📄</div>
                      <p className="m-0 mb-2 font-bold text-lg text-base-content">
                        {values.resume ? values.resume.name : 'Click to upload your resume'}
                      </p>
                      <p className="m-0 text-base-content/60 text-sm">
                        Accepted formats: PDF, DOC, DOCX (Max 5MB)
                      </p>
                    </label>
                  </div>
                  {touched.resume && errors.resume && (
                    <p className="text-error text-sm mt-2">
                      {errors.resume}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[250px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    {isSubmitting ? <span className="loading loading-spinner"></span> : 'Submit Application'}
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
