const fetcher = async <T>(
  url: URL | RequestInfo,
  options?: RequestInit | undefined,
  throwError = false
) => {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
    });

    const data = await res.json();
    if (data?.error) throw new Error(data.error);
    return data as T;
  } catch (error: any) {
    if (throwError) throw new Error(error);
    return null;
  }
};

export default fetcher;
