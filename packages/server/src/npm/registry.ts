const NPM_REGISTRY_ENDPOINT = "https://registry.npmjs.org";

export const getPackage = async (package_name: string) => {
  const url = new URL(package_name, NPM_REGISTRY_ENDPOINT);
  const response = await fetch(url, { method: "GET" });
  const json = await response.json();

  return json as { versions: any[] };
}