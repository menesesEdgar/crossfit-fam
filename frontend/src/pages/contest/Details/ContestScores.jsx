import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/Table/TableHeader";
import { MdOutlineLeaderboard } from "react-icons/md";
import Leaderboard from "../../../components/ContestComponents/Leaderboard";
import { Dropdown } from "flowbite-react";
import { IoFilterSharp } from "react-icons/io5";
import { useContestContext } from "../../../context/ContestContext";
import { useParams } from "react-router-dom";

const ContestScores = () => {
  const {
    fetchAthletesByCategory,
    athletes,
    contest,
    loading,
    categories,
    wods: allWods,
    addScoreToAthlete,
  } = useContestContext();
  const { id } = useParams();
  const [wods, setWods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateScores, setUpdateScores] = useState(false)
  useEffect(() => {
    async function getAthletesByCategory() {
      await fetchAthletesByCategory({
        contestId: id,
        categoryId: selectedCategory?.conCatId,
      });
    }
    if (selectedCategory) {
      const category = categories.find(
        (cat) => cat.conCatId === selectedCategory?.conCatId
      );
      if (category) {
        const { categoryWods } = category;
        const newWods = categoryWods.map((wod) => {
          return {
            ...wod,
            name: allWods.find((c) => c.conWodId === wod.contestWodId)?.name,
          };
        });
        setWods(newWods);
      }
      getAthletesByCategory();
    }
  }, [contest, selectedCategory, updateScores]);

  useEffect(() => {
    if (categories && categories?.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  if (!contest && athletes.length === 0) return;
  return (
    <div className="flex min-h-[77dvh] h-full bg-white max-h-[90.5dvh] md:max-h-[91.5dvh] overflow-hidden flex-col gap-2 shadow-md rounded-md dark:bg-gray-900 antialiased">
      <div className="pt-6 md:pt-4 p-4 pb-0 flex items-center justify-between">
        <TableHeader
          icon={MdOutlineLeaderboard}
          backAction
          title={"Puntajes"}
        />
        <div className="flex gap-2">
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
            {categories &&
              categories?.map((category) => (
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
      </div>
      <div className="w-full flex-1 overflow-y-auto">
        {contest && athletes && wods && (
          <Leaderboard
            setUpdateScores={setUpdateScores}
            category={selectedCategory}
            competition={contest}
            athletes={athletes}
            wods={wods}
            addScoreToAthlete={addScoreToAthlete}
          />
        )}
      </div>
    </div>
  );
};

export default ContestScores;
