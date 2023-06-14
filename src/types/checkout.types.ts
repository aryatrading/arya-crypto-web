export type Price = {
    id: number;
    price: {
      id: number;
      amount: number;
      active: boolean;
      recurring: string;
      product: {
        id: number;
        name: string;
        description: null | string;
        stripe_id: string;
        active: boolean;
        sku: string;
        brand: string;
        tag: null | string;
        taxable: string;
        created_at: Date;
        updated_at: Date;
        has_checkout_questionnary: boolean;
        image: null;
      };
      stripe_id: string;
      hubspot_id: null;
      currency: string;
      description: string;
      recurring_count: number;
      amount_initial: null;
      iteration: null;
      public: boolean;
      created_at: Date;
      updated_at: Date;
      tag: null;
      stripe_provider: string;
      months_commitments: null;
      subscription_balance: null;
    };
    order: number;
    bestoffer: boolean;
    tooltip: null;
  };
  
  export type Product = {
    id: number;
    name: string;
    description: null | string;
    stripe_id: string;
    active: boolean;
    sku: string;
    brand: string;
    tag: null | string;
    taxable: string;
    created_at: Date;
    updated_at: Date;
    has_checkout_questionnary: boolean;
    translations: any[]; // Update the type accordingly
    image: null;
  };
  
  export type Subscription = {
    id: number;
    description: string;
    slug: string;
    currency: string;
    product: Product;
    published_at: Date;
    created_at: Date;
    updated_at: Date;
    type: string;
    prices: Price[];
    bump: any[]; // Update the type accordingly
    upsell: any[]; // Update the type accordingly
    free_included: any[]; // Update the type accordingly
    downsell: null | any; // Update the type accordingly
    restriction: any[]; // Update the type accordingly
  };
  