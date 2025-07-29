import { BiSearch } from "react-icons/bi";
import { TbChartGridDots } from "react-icons/tb";

const Search = () => {
  return (
    <div className="flex justify-between my-10 mx-8 gap-5">
      <div className="flex flex-1 justify-between items-center bg-white rounded-xl gap-4">
        <input
          placeholder="Search..."
          type="search"
          className="mx-4 placeholder:font-bold placeholder:text-xl flex-1 outline-none"
        />
        <div className="size-16 text-4xl font-bold mr-4 flex items-center justify-center">
          <BiSearch />
        </div>
      </div>
      <div className="size-16 text-3xl bg-white rounded-xl flex items-center justify-center">
        <TbChartGridDots />
      </div>
    </div>
  );
};

export default Search;
