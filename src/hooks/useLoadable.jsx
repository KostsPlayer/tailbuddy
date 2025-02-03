import { Suspense } from "react";
import LoaderPages from "../components/loader/LoaderPages";

const useLoadable = (Component) => {
  const LoadableComponent = (props) => {
    return (
      <Suspense fallback={<LoaderPages />}>
        <Component {...props} />
      </Suspense>
    );
  };

  // Tambahkan displayName
  LoadableComponent.displayName = `useLoadable(${
    Component.displayName || Component.name || "Unknown"
  })`;

  return LoadableComponent;
};

export default useLoadable;
