export interface PackageSearchData {
  objects: Array<{
    package: {
      name: string,
      description: string,
      version: string,
      keywords: Array<string>,
    }
  }>;
}

/**
 * Data received when calling the
 * `/{package_name}` endpoint on the registry.
 */
export interface PackageData {
  /** Should be same as `{package_name}`. */
  name: string
  /** Might be empty sometimes. */
  description: string

  /**
   * @example
   * { latest: "15.1.0" }
   */
  "dist-tags": Record<string, string>
  
  /**
   * @example
   * { "15.1.0": PackageVersionData }
   */
  versions: Record<string, PackageVersionData>
}

/**
 * Data can be either from
 * - `PackageData["versions"][string]` ;
 * - `/{package_name}/{package_version}` endpoint on the registry.
 */
export interface PackageVersionData {
  name: string
  description: string
  version: string

  repository: {
    type: "git"
    url: string
  }

  bugs: {
    url: string
  }

  homepage: string
  keywords: Array<string>
  license: string

  /**
   * @example
   * { "package-name": "^0.1.0" }
   */
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  peerDependencies: Record<string, string>

  dist: {
    integrity: string
    shasum: string
    tarball: string
    fileCount: number
    unpackedSize: number
    signatures: Array<{
      keyid: string
      sig: string
    }>
  }
}

class PackageVersion {
  #data: PackageVersionData

  constructor (data: PackageVersionData) {
    this.#data = data;
  }

  get tarball () {
    return this.#data.dist.tarball;
  }
}

class Package {
  private raw_versions: Record<string, PackageVersionData>
  public tags: Record<string, string>
  
  constructor (pkg: PackageData) {
    this.tags = pkg["dist-tags"];
    this.raw_versions = pkg.versions
  }

  public getVersion (version: string) {
    if (!(version in this.raw_versions)) {
      throw new Error("this version doesn't exist.");
    }

    return new PackageVersion(this.raw_versions[version]);
  }
}

export default Package;
