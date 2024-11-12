import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/Table/TableHeader";
import { MdOutlineLeaderboard } from "react-icons/md";
import Leaderboard from "../../../components/ContestComponents/Leaderboard";
import { Checkbox, Dropdown } from "flowbite-react";
import { IoFilterSharp } from "react-icons/io5";
import { FaRegSquare, FaVenusMars } from "react-icons/fa";
import { FaSquareCheck } from "react-icons/fa6";
import { useContestContext } from "../../../context/ContestContext";
import { Select } from "flowbite-react";
import { useParams } from "react-router-dom";
const competition = {
  name: "Gordoton Supremo",
};

const ContestScores = () => {
  const { fetchAthletesByCategory, athletes, contest, loading, categories, wods: allWods  } = useContestContext()
  console.log("allWods ", allWods)
  const { id } = useParams()
  const [wods, setWods] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null);
  console.log("categories ", categories)
  useEffect(() => {
      async function getAthletesByCategory () {
        await fetchAthletesByCategory({contestId: id, categoryId: selectedCategory?.conCatId })
      }
      if (selectedCategory) {
        const category = categories.find((cat) => cat.conCatId === selectedCategory?.conCatId)
        if (category) {
          const { categoryWods } = category
          const newWods = categoryWods.map((wod) => {
            console.log("wod ", wod)
            return {
              ...wod,
              name: allWods.find((c) => c.conWodId === wod.contestWodId)?.name
            }
          })
          setWods(newWods)
        }
        getAthletesByCategory()
      }
  }, [contest, selectedCategory])

  useEffect(() => {
    if (categories && categories?.length > 0) {
      setSelectedCategory(categories[0])
    }
  }, [categories])
  console.log("wods ",wods)

  if (!contest && athletes.length === 0) return ;
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
          inline
          placement="bottom-start"
          className="md:w-52"
        >
          {categories && categories?.map((category) => (
            <Dropdown.Item
              key={category.id}
              className="min-w-36 min-h-12"
              onClick={() => setSelectedCategory(category)}
            >
              <span>{category.name}</span>
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div>
        {contest && athletes && wods && (
          <Leaderboard
          category={selectedCategory}
          competition={contest}
          athletes={athletes}
          wods={wods}
        />
        )}

      </div>
    </div>
  );
};

export default ContestScores;
