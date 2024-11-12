import React, { useState } from "react";
import TableHeader from "../../components/Table/TableHeader";
import { MdOutlineLeaderboard } from "react-icons/md";
import Leaderboard from "../../components/ContestComponents/Leaderboard";
import { Checkbox, Dropdown } from "flowbite-react";
import { IoFilterSharp } from "react-icons/io5";
import { FaRegSquare } from "react-icons/fa";
import { FaSquareCheck } from "react-icons/fa6";
const competition = {
  name: "Gordoton Supremo",
};

const categories = [
  { id: 1, name: "RX" },
  { id: 2, name: "Scaled" },
];

const wods = [
  { id: 1, name: "Flexiones" },
  { id: 2, name: "Lagartijas" },
  { id: 3, name: "Succionadas de Fierro" },
];

const athletes = [
  {
    id: 1,
    name: "Marco Ruiz",
    category: "RX",
    scores: {
      1: { quantity: 172, time: "04:43" },
      2: { quantity: 150, time: "03:30" },
      3: { quantity: 200, time: "04:02" },
    },
  },
  {
    id: 2,
    name: "Juan Perez",
    category: "RX",
    scores: {
      1: { quantity: 150, time: "04:43" },
      2: { quantity: 130, time: "03:30" },
      3: { quantity: 180, time: "04:02" },
    },
  },
  {
    id: 3,
    name: "Pedro Sanchez",
    category: "Scaled",
    scores: {
      1: { quantity: 100, time: "04:43" },
      2: { quantity: 90, time: "03:30" },
      3: { quantity: null, time: "" },
    },
  },
];
const Score = () => {
  const [selectedCategories, setSelectedCategories] = useState(categories);

  const onSelectedCategoriesChange = (e) => {
    const selectedCategories = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedCategories(selectedCategories);
  };

  return (
    <div className="flex p-4 min-h-[77dvh] h-full bg-white max-h-[90.5dvh] md:max-h-[91.5dvh] overflow-hidden flex-col md:gap-4  shadow-md rounded-md dark:bg-gray-900 antialiased">
      <div className="flex justify-between">
        <TableHeader icon={MdOutlineLeaderboard} title={"Puntajes"} />
        <Dropdown
          renderTrigger={() => (
            <button className="w-fit bg-white hover:bg-neutral-200 md:w-fit h-9 xl:h-10 text-sm xl:text-base cursor-pointer transition ease-in-out duration-200 p-4 flex items-center justify-center rounded-md border text-stone-800">
              <span className="mr-3">
                <IoFilterSharp className="text-lg text-neutral-600" />
              </span>
              Categorias
            </button>
          )}
          dismissOnClick={false}
          inline
          arrowIcon={null}
          placement="bottom-start"
          className="md:w-52"
        >
          {categories?.map((category, index) => (
            <Dropdown.Item
              key={index}
              className="min-w-36 min-h-12"
              icon={
                categories.includes(category) ? (
                  <FaRegSquare
                    checked={true}
                    onChange={() => {}}
                    label={category.name}
                  />
                ) : (
                  <FaSquareCheck
                    checked={false}
                    onChange={() => {}}
                    label={category.name}
                  />
                )
              }
            >
              <span>{category.name}</span>
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div>
        <Leaderboard
          competition={competition}
          athletes={athletes}
          categories={categories}
          wods={wods}
        />
      </div>
    </div>
  );
};

export default Score;
