interface UrlListProps {
  name: string;
  value: string;
}

/**
 * 获取网站共有的Url，Url仅brand部分不同
 * @param brandUrl
 * @param urlList
 */
module.exports = function(brandUrl: string, urlList: Array<UrlListProps>) {
  const result = {};
  urlList.forEach(item => {
    result[item.name] = item.value.replace(/\$\{brandUrl\}/g, brandUrl);
  });
  return result;
};
