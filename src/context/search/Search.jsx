import { useContext } from "react";
import SearchContext from "./SearchContext";

function Search() {
  const context = useContext(SearchContext);
  return context;
}

export default Search;
