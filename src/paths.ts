const paths = {
  home() {
    return '/';
  },
  invoices() {
    return '/invoice/list';
  },
  packages() {
    return '/package/list';
  },
  package(name: string) {
    return `/package/${name}`;
  },
  newPackage() {
    return '/package/new';
  },
  profile() {
    return '/profile';
  }
};

export default paths;