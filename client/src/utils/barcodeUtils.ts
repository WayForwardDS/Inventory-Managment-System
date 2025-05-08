export const validateBarcode = (barcode: string): boolean => {
    
    return /^[A-Za-z0-9]{8,}$/.test(barcode);
  };
  
  export const formatBarcode = (barcode: string): string => {
    
    return barcode.replace(/(\d{4})(?=\d)/g, '$1 ');
  };