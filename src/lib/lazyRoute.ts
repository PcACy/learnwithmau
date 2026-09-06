import React, { lazy, type ComponentType } from 'react';

export interface PreloadableComponent<P extends Record<string, unknown> = Record<string, unknown>>
  extends React.FC<P> {
  preload: () => Promise<ComponentType<P>>;
}

export function lazyRoute<P extends Record<string, unknown> = Record<string, unknown>>(
  factory: () => Promise<Record<string, unknown>>,
  exportName?: string,
): PreloadableComponent<P> {
  let loadedComponent: ComponentType<P> | null = null;
  let loadPromise: Promise<ComponentType<P>> | null = null;

  const load = () => {
    if (!loadPromise) {
      loadPromise = factory().then((module) => {
        const comp = (exportName ? module[exportName] : (module.default ?? module)) as ComponentType<P>;
        loadedComponent = comp;
        return comp;
      });
    }
    return loadPromise;
  };

  const LazyComponent = lazy(async () => {
    const comp = await load();
    return { default: comp };
  });

  const Component: PreloadableComponent<P> = (props: P) => {
    if (loadedComponent) {
      return React.createElement<P>(loadedComponent, props);
    }
    return React.createElement<P>(LazyComponent, props);
  };

  Component.preload = load;
  return Component;
}
