const fetcher = async <T>(
  url: URL | RequestInfo,
  options?: RequestInit | undefined
) => {
  try {
    const { data } = await fetch(url, {
      ...options,
      credentials: 'include',
    }).then((res) => res.json());

    return data as T;
  } catch (error: any) {
    return null;
  }
};

export default fetcher;
