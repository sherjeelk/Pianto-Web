
  export interface Service {
    enable: boolean;
    _id: string;
    name: string;
    name_fi: string;
    type: string;
    price: number;
    desc: string;
    desc_fi: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  export interface Services {
    results: Service[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  }


