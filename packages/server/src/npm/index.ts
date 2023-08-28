import Package, { PackageSearchData, type PackageData } from "@/npm/package";

class NPM {
  public registry: string

  constructor (registry = "https://registry.npmjs.org") {
    this.registry = registry;
  }

  public async search (search_input: string, page: number) {
    const url = new URL(`/-/v1/search?text=${search_input}&size=5&from${(page * 5) + 1}`, this.registry);
    const response = await fetch(url, {
      method: "GET"
    });

    const data = await response.json() as PackageSearchData;
    return data;
  }
  
  public async package (package_name: string): Promise<Package> {
    const url = new URL(package_name, this.registry);
    const response = await fetch(url, {
      method: "GET"
    });

    const data = await response.json() as PackageData;
    return new Package(data);
  }
}

export default NPM;
