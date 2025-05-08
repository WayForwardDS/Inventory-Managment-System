const formatDateLocal = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString(); 
  };

  export default formatDateLocal;