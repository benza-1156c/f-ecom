interface Product {
  ID: number;
  Name: string;
  Price: number;
  OriginalPrice: number;
  CategoryID: number;
  BrandID: number;
  Image: string;
  Description: string;
  Stock: number;
  Rating: number;
  Reviews: number;
}

interface Category {
  ID: number;
  Name: string;
  Icon: string;
}

interface Brand {
  ID: number;
  Name: string;
  Icon: string;
}
