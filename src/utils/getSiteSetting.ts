import SiteSetting from '../constants/siteSetting';
import Company from '../constants/company';

export default function getSiteSetting(site: string) {
  const data = {};
  for (let key in SiteSetting) {
    data[key] = SiteSetting[key].includes(site);
  }

  return { ...data, ...isCompany(site) };
}

export function isCompany(site: string) {
  return {
    isNVCompany: false,
    isAPPCompany: false,
    isCACompany: false,
    isGPSCompany: false,
    isOPGCompany: false,
    ...Company[site].isCompany
  };
}
