export type ProfileFormErrors = {
  name?: string;
  phone?: string;
  socialLink?: string;
};

export function validateProfileForm(data: {
  name: string;
  phone: string;
  socialLink: string;
}): ProfileFormErrors {
  const errors: ProfileFormErrors = {};
  const name = data.name.trim();
  const phone = data.phone.trim();
  const social = data.socialLink.trim();

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (phone && !/^[\d\s+\-().]{7,20}$/.test(phone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (social && !/^https?:\/\/.+/i.test(social)) {
    errors.socialLink = 'Social link must start with http:// or https://';
  }

  return errors;
}

export function hasProfileErrors(errors: ProfileFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
