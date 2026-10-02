export const ROLES = {
  CUSTOMER: 'Customer',
  BARBER: 'Barber',
  RECEPTIONIST: 'Receptionist',
  ADMIN: 'Admin',
};

export const ROLE_META = {
  Customer: {
    label: 'Customer',
    tagline: 'Book visits, shop products',
    accent: 'brass',
    home: '/app/customer',
  },
  Barber: {
    label: 'Barber / Stylist',
    tagline: 'Manage your chair & earnings',
    accent: 'emerald',
    home: '/app/barber',
  },
  Receptionist: {
    label: 'Receptionist',
    tagline: 'Run the front desk',
    accent: 'clay',
    home: '/app/receptionist',
  },
  Admin: {
    label: 'Administrator',
    tagline: 'Oversee the whole salon',
    accent: 'ink',
    home: '/app/admin',
  },
};

export const APPOINTMENT_STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export const STATUS_STYLES = {
  Pending: 'bg-stone-200 text-ink-600',
  Confirmed: 'bg-brass-100 text-brass-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-600',
  Cancelled: 'bg-clay-100 text-clay-600',
  Approved: 'bg-emerald-100 text-emerald-600',
  Rejected: 'bg-clay-100 text-clay-600',
  Paid: 'bg-emerald-100 text-emerald-600',
  Hold: 'bg-stone-200 text-ink-600',
  Processing: 'bg-brass-100 text-brass-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-emerald-100 text-emerald-600',
  Failed: 'bg-clay-100 text-clay-600',
  Refunded: 'bg-stone-200 text-ink-600',
};

export const SERVICE_CATEGORIES = [
  'Haircut',
  'Beard Styling',
  'Hair Coloring',
  'Facial',
  'Spa',
  'Massage',
  'Manicure',
  'Pedicure',
  'Other',
];

export const PRODUCT_CATEGORIES = ['Hair Care', 'Skin Care', 'Beard Care', 'Styling', 'Tools', 'Accessories', 'Other'];

export const INVENTORY_CATEGORIES = [
  'Shampoo',
  'Hair Wax',
  'Hair Color',
  'Face Cream',
  'Gel',
  'Oil',
  'Razor',
  'Towel',
  'Cape',
  'Scissors',
  'Other',
];

export const INVENTORY_UNITS = ['pieces', 'bottles', 'tubes', 'packets', 'liters', 'kg'];

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
