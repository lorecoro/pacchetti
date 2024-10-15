const paths = {
  home() {
    return '/';
  },
  companies() {
    return '/company/list';
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
  newEntry() {
    return '/entry/new';
  },
  profile() {
    return '/profile';
  }
};

export default paths;