import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ScrollRevealDirective } from '../../animations/scroll-reveal.directive';
import { ContactService, ContactFormData } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScrollRevealDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  errorMessage: string | null = null;
  serverSuccessMessage = 'Thank you for reaching out. A Provex engineer will get back to you shortly to discuss your project.';

  countryCodes = [
    // Top Priority & South Asia
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+1', name: 'USA / Canada', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
    { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
    { code: '+66', name: 'Thailand', flag: '🇹🇭' },
    { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
    { code: '+63', name: 'Philippines', flag: '🇵🇭' },
    { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+46', name: 'Sweden', flag: '🇸🇪' },
    { code: '+47', name: 'Norway', flag: '🇳🇴' },
    { code: '+45', name: 'Denmark', flag: '🇩🇰' },
    { code: '+353', name: 'Ireland', flag: '🇮🇪' },
    { code: '+974', name: 'Qatar', flag: '🇶🇦' },
    { code: '+968', name: 'Oman', flag: '🇴🇲' },
    { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
    { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' }
  ];

  services = [
    { value: 'Product Design', label: 'Product Design' },
    { value: 'CAD Modeling', label: 'CAD Modeling' },
    { value: 'FEA / CFD', label: 'FEA / CFD' },
    { value: 'Prototyping', label: 'Prototyping' },
    { value: 'Manufacturing Support', label: 'Manufacturing Support' },
    { value: 'Complete Product Development', label: 'Complete Product Development' },
    { value: 'Other', label: 'Other Inquiry' }
  ];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      company: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      countryCode: ['+91', [Validators.required]],
      phoneNumber: ['', [Validators.required, this.customPhoneValidator.bind(this)]],
      subject: ['Product Design', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(3000)]]
    });

    // Re-validate phone number whenever country code changes
    this.contactForm.get('countryCode')?.valueChanges.subscribe(() => {
      this.contactForm.get('phoneNumber')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    // Smart UX: Auto-detect visitor's country by IP without slowing down the page
    this.contactService.detectUserCountry().subscribe(detectedCode => {
      if (detectedCode) {
        const found = this.countryCodes.some(c => c.code === detectedCode);
        if (found) {
          this.contactForm.patchValue({ countryCode: detectedCode });
        }
      }
    });
  }

  // Custom phone number validator based on selected country
  customPhoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const value = control.value.replace(/\s+/g, '');
    const country = this.contactForm?.get('countryCode')?.value || '+91';

    // Disallow non-numeric characters
    if (!/^\d+$/.test(value)) {
      return { nonNumeric: true };
    }

    // Specific validation for India (+91): must be 10 digits starting with 6-9
    if (country === '+91') {
      const isValidIndian = /^[6-9]\d{9}$/.test(value);
      return isValidIndian ? null : { invalidIndiaPhone: true };
    }

    // Specific validation for US / Canada (+1): 10 digits
    if (country === '+1') {
      const isValidUS = /^[2-9]\d{9}$/.test(value);
      return isValidUS ? null : { invalidUSPhone: true };
    }

    // General international validation: 7 to 14 digits
    if (value.length < 7 || value.length > 14) {
      return { invalidLength: true };
    }

    return null;
  }

  getPhoneErrorMessage(): string {
    const control = this.f['phoneNumber'];
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'Phone number is required';
    }
    if (control.errors['nonNumeric']) {
      return 'Only numbers are allowed';
    }
    if (control.errors['invalidIndiaPhone']) {
      return 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
    }
    if (control.errors['invalidUSPhone']) {
      return 'Please enter a valid 10-digit phone number';
    }
    if (control.errors['invalidLength']) {
      return 'Please enter a valid number between 7 and 14 digits';
    }
    return 'Please enter a valid phone number';
  }

  // Strip invalid characters on typing and enforce country-specific length limits
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let sanitized = input.value.replace(/[^0-9]/g, '');
    const country = this.contactForm.get('countryCode')?.value;
    const maxDigits = (country === '+91' || country === '+1') ? 10 : 13;

    if (sanitized.length > maxDigits) {
      sanitized = sanitized.slice(0, maxDigits);
    }

    if (input.value !== sanitized) {
      input.value = sanitized;
      this.contactForm.get('phoneNumber')?.setValue(sanitized);
    }
  }

  // Helper getters for template validation
  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.contactForm.invalid || this.isSubmitting) {
      this.markFormGroupTouched(this.contactForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const countryCode = this.contactForm.value.countryCode;
    const phoneDigits = this.contactForm.value.phoneNumber.trim();
    const fullPhoneNumber = `${countryCode} ${phoneDigits}`;

    const payload: ContactFormData = {
      fullName: this.contactForm.value.fullName.trim(),
      company: this.contactForm.value.company ? this.contactForm.value.company.trim() : '',
      email: this.contactForm.value.email.trim(),
      phoneNumber: fullPhoneNumber,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message.trim()
    };

    this.contactService.submitContactForm(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        if (response.message) {
          this.serverSuccessMessage = response.message;
        }
        this.contactForm.reset({
          countryCode: this.contactForm.value.countryCode || '+91',
          subject: 'Product Design'
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          this.errorMessage = err.error.errors.map((e: any) => e.message || e).join(', ');
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 0) {
          this.errorMessage = 'Could not connect to the backend server. Please verify the server is running on port 5000.';
        } else {
          this.errorMessage = 'Submission failed. Please check your details and try again.';
        }
      }
    });
  }

  resetForm() {
    const currentCountry = this.contactForm.value.countryCode || '+91';
    this.isSubmitted = false;
    this.errorMessage = null;
    this.contactForm.reset({
      countryCode: currentCountry,
      subject: 'Product Design'
    });
  }

  clearError() {
    this.errorMessage = null;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
