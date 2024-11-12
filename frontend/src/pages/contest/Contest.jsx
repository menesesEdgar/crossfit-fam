import React, { useCallback, useEffect, useRef, useState, lazy } from "react";

import Skeleton from "react-loading-skeleton";
import { IoMdAdd } from "react-icons/io";
import { useCatalogContext } from "../../context/CatalogContext";
import ModalRemove from "../../components/Modals/ModalRemove";
import ContestFormFields from "../../components/ContestComponents/ContestFormFields";
import ModalFormikForm from "../../components/Modals/ModalFormikForm";
import { ContestFormSchema, RegisterAthleteSchema } from "../../components/ContestComponents/ContestFormSchema";
import { CiCircleRemove } from "react-icons/ci";
import withPermission from "../../utils/withPermissions";
import useCheckPermissions from "../../hooks/useCheckPermissions";
import { formatMxnDate } from "../../utils/formatDates";
import { useNavigate } from "react-router-dom";
import { FaCog, FaEdit, FaTrash, FaTrophy, FaCheck } from "react-icons/fa";
import CardContest from "../../components/Card/CardContest";
import ModalViewer from "../../components/Modals/ModalViewer";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import { TbArrowBackUp } from "react-icons/tb";
const TableHeader = lazy(() => import("../../components/Table/TableHeader"));
const TableActions = lazy(() => import("../../components/Table/TableActions"));
const TableResultsNotFound = lazy(() =>
  import("../../components/Table/TableResultsNotFound")
);
import PublishImage from "../../assets/images/publish.webp";
import { MdInfo, MdOutlineFilterList } from "react-icons/md";
import { Checkbox, Dropdown, Label } from "flowbite-react";
import { useAuthContext } from "../../context/AuthContext";
import ContestRegisterFields from "../../components/ContestComponents/ContestRegisterFields";
import { useContestContext } from "../../context/ContestContext";
import { getContests } from "../../services/api";
import { useQuery } from "@tanstack/react-query";

// import BgPublicContest from "../../assets/bg/bg-public-contest.webp";

const initValues = {
  name: "",
  location: "",
  organizer: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  status: "Borrador",
  id: "",
};
const Contest = () => {
  const { contests: allContests } = useCatalogContext();

  const {
    createContest,
    updateContest,
    deleteContest,
    loading,
    setContestNextStep,
    addAthleteToContest,
    removeAthleteFromContest
  } = useCatalogContext();
  const { user } = useAuthContext();
  // For security, athlete by default otherwise admin or root
  const role = user?.role?.name || "Athlete"
  const isViewPermissions = useCheckPermissions("view_contest");
  const isCreatePermissions = useCheckPermissions("create_contest");
  const isEditPermissions = useCheckPermissions("edit_contest");
  const isDeletePermissions = useCheckPermissions("delete_contest");
  const [registerValues, setRegisterValues] = useState({
    userId: user?.id,
    categoryId: null,
  })

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [removeContestId, setRemoveContestId] = useState(null);
  const [contests, setContests] = useState([]);
  const [contestCategories, setContestCategories] = useState([]);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [isSubscribeEnable, setIsSubscribeEnable] = useState(false);
  const [isOpenCancelSubscriptionModal , setIsOpenCancelSubscriptionModal ] = useState(false);
  const [registerId, setRegisterId] = useState(null);
  const [search, setSearch] = useState("");
  const [initialValues, setInitialValues] = useState({
    ...initValues,
  });
  const [modalNextStep, setModalNextStep] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [contestToUpdateStep, setContestToUpdateStep] = useState(null);
  const navigate = useNavigate();
  const filteredContests = contests?.filter(
    (contest) =>
      JSON.stringify(contest).toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter.length === 0 || statusFilter.includes(contest.status))
  );

  useEffect(() => {
    setContests(allContests);
  }, [allContests]);

  const onEditContest = (contest) => {
    setEditMode(true);
    setInitialValues({
      ...contest,
      startDate: contest?.startDate ? contest.startDate.split("T")[0] : "",
      endDate: contest?.endDate ? contest.endDate.split("T")[0] : "",
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      editMode ? await updateContest(values) : await createContest(values);
      resetForm();
      setInitialValues({
        ...initValues,
      });
      setIsOpenModal(false);
      setEditMode(false);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  const onCloseModal = () => {
    setOpenRegisterModal(false)
    setOpenRegisterModal(false)
    setIsOpenModal(false);
    setEditMode(false);
    setInitialValues({
      ...initValues,
    });
  };

  const onDeleteContest = async () => {
    try {
      await deleteContest(removeContestId);
      setIsOpenDeleteModal(false);
      setRemoveContestId(null);
    } catch (error) {
      console.error(error);
      setIsOpenDeleteModal(false);
    }
  };

  const onCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
    setRemoveContestId(null);
  };

  const onOpenDeleteModal = (contestId) => {
    setIsOpenDeleteModal(true);
    setRemoveContestId(contestId);
  };

  const extractAthletesFromCategories = (categories) => {
    return categories?.reduce((acc, category) => {
      return acc + category?.athletes?.length;
    }, 0);
  };

  const extractCategoryNames = (categories) => {
    return categories?.map((category) => category?.category?.name);
  };

  const handleContestNextStep = useCallback(async () => {
    try {
      await setContestNextStep({
        id: contestToUpdateStep.id,
        step: contestToUpdateStep.status,
      });
      setModalNextStep(false);
    } catch (error) {
      console.error(error);
    }
  }, [contestToUpdateStep, setContestNextStep]);

  const handleFilterByStatus = (status) => {
    setStatusFilter((prevStatusFilter) => {
      if (prevStatusFilter.length === 0) {
        return [status];
      }

      if (prevStatusFilter.includes(status)) {
        return prevStatusFilter.filter((s) => s !== status);
      } else {
        return [...prevStatusFilter, status];
      }
    });
  };

  const handleFilterAll = () => {
    setStatusFilter([]);
  };

  const checkIfCanNextStep = (contest, step) => {
    if (step === "Borrador") {
      return true;
    }
    if (step === "Abierta") {
      return contest?.categories?.length > 0;
    }
    if (step === "En curso") {
      return contest?.wods?.length > 0;
    }
    if (step === "Finalizada") {
      return contest?.categories?.length > 0;
    }
    return false;
  };
  const handleRegister = async (contest) => {
    if (contest?.isRegistered && contest?.registerId) {
      setIsOpenCancelSubscriptionModal(true)
      setRegisterId(contest.registerId)
      setRemoveContestId(contest.id)
    }
    if (contest?.categories?.length > 0 && !contest?.isRegistered) {
      setIsSubscribeEnable(true)
      setContestCategories(contest.categories)
      setRegisterValues({
        userId: user?.id,
        category: contest.categories[0].id,
      });
      setOpenRegisterModal(true)
    }
  }
  // This button is no handle the scubription cancellation
  const handleCancelSubscription = async () => {
    if (registerId) {
      await removeAthleteFromContest(registerId);
      setIsOpenCancelSubscriptionModal(false)
    }
  }
  const handleRegisterAthlete = async (values, { setSubmitting, resetForm }) => {
    try {
      isSubscribeEnable ?
      await addAthleteToContest({
        userId: user?.id,
        categoryId: parseInt(values?.category),
        contestId: parseInt()
      }) : () => {};
      resetForm();
      setRegisterValues({
        userId: user?.id,
        categoryId: null,
      });
      setRegisterId(null)
      setOpenRegisterModal(false);
      setEditMode(false);
      setIsOpenCancelSubscriptionModal(false)
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[77dvh] h-full bg-white max-h-[90.5dvh] md:max-h-[91.5dvh] overflow-hidden flex-col md:gap-4  shadow-md rounded-md dark:bg-gray-900 antialiased">
      <div className="flex flex-col gap-2 px-2 md:px-4 pt-4">
        <TableHeader
          icon={FaTrophy}
          title={"Competencias"}
          actions={[
            {
              label: "Nuevo",
              action: isCreatePermissions.hasPermission
                ? () => setIsOpenModal(true)
                : null,
              color: "crossfit",
              icon: IoMdAdd,
              filled: true,
            },
          ]}
        />
        <div className="flex gap-2">
          <TableActions handleSearchTerm={(e) => setSearch(e.target.value)} />
          <Dropdown
            renderTrigger={() => (
              <button className="w-fit bg-white hover:bg-neutral-200 md:w-fit h-9 xl:h-10 text-sm xl:text-base cursor-pointer transition ease-in-out duration-200 p-4 flex items-center justify-center rounded-md border text-stone-800">
                <MdOutlineFilterList className="text-lg text-neutral-900" />
              </button>
            )}
          >
            <Dropdown.Item
              onClick={() => handleFilterByStatus("Borrador")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                id="draft"
                color="purple"
                type="checkbox"
                readOnly
                checked={statusFilter.includes("Borrador")}
                className="mr-2 cursor-pointer h-6 w-6"
              />
              <Label htmlFor="draft">Borradores</Label>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleFilterByStatus("Abierta")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                id="open"
                color="purple"
                type="checkbox"
                readOnly
                checked={statusFilter.includes("Abierta")}
                className="mr-2 cursor-pointer h-6 w-6"
              />
              <Label htmlFor="open">Abierta</Label>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleFilterByStatus("En curso")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                id="in_curse"
                color="purple"
                type="checkbox"
                readOnly
                checked={statusFilter.includes("En curso")}
                className="mr-2 cursor-pointer h-6 w-6"
              />
              <Label htmlFor="in_curse">En curso</Label>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleFilterByStatus("Finalizada")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                id="finished"
                color="purple"
                type="checkbox"
                readOnly
                checked={statusFilter.includes("Finalizada")}
                className="mr-2 cursor-pointer h-6 w-6"
              />
              <Label htmlFor="finished">Finalizada</Label>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={handleFilterAll}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                id="all"
                color="purple"
                type="checkbox"
                readOnly
                checked={statusFilter.length === 0}
                className="mr-2 cursor-pointer h-6 w-6"
              />
              <Label htmlFor="all">Todas las competencias</Label>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      {filteredContests && !loading ? (
        filteredContests?.length > 0 ? (
          <div className="px-2 md:px-4 pb-4 h-full max-h-[77.2dvh] overflow-auto grid gap-4 md:gap-6 grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))]">
            {filteredContests?.map((contest, index) => {
              const parseContest = {
                id: contest.id,
                title: contest.name,
                organizer: contest.organizer,
                startDate: formatMxnDate(contest?.startDate || null),
                endDate: formatMxnDate(contest?.endDate || null) || "Sin fecha",
                status: contest.status,
                location: contest.location,
                quantityAthletes: contest?.athletes?.length || 0,
                categories: contest?.categories
                  ? extractCategoryNames(contest.categories)
                  : [],
              };
              return (
                <CardContest
                  key={contest.id}
                  contest={parseContest}
                  role={role}
                  collapsedActions={[
                    {
                      label: "Configurar",
                      action: isEditPermissions.hasPermission
                        ? () => onEditContest(contest)
                        : null,
                      icon: FaCog,
                    },
                    {
                      label: "Eliminar Competencia",
                      action: isDeletePermissions.hasPermission
                        ? () => onOpenDeleteModal(contest.id)
                        : null,
                      icon: FaTrash,
                    },
                  ]}
                  actions={role !== "Athlete" ? [
                    {
                      label: "Editar",
                      action: () => navigate(`/contest/${contest.id}`),
                      color: "neutral",
                      icon: FaEdit,
                    },
                    {
                      label: "Publicar",
                      action: () => {
                        setContestToUpdateStep(contest);
                        setModalNextStep(true);
                      },
                      color: "neutral",
                      icon: HiOutlineSpeakerphone,
                    },
                  ] : [
                    {
                      label: !contest.isRegistered ? "Inscribirse" : "Cancelar inscripción",
                      disabled: !(contest?.categories?.length > 0),
                      action: () => handleRegister(contest),
                      color: !contest.isRegistered ? "neutral" : "red",
                      icon: FaEdit,
                    },
                  ]}
                />
              );
            })}
          </div>
        ) : (
          <TableResultsNotFound />
        )
      ) : (
        <Skeleton count={10} className="h-10" />
      )}

      {openRegisterModal && (
        <ModalFormikForm
          onClose={onCloseModal}
          isOpenModal={openRegisterModal}
          dismissible
          title="Registrate en tu categoría"
          schema={RegisterAthleteSchema}
          initialValues={registerValues}
          onSubmit={handleRegisterAthlete}
          formFields={<ContestRegisterFields isUpdate={editMode} categories={contestCategories}/>}
          saveLabel={editMode ? "Actualizar" : "Guardar"}
        />
      )}
      {isOpenModal && (
        <ModalFormikForm
          onClose={onCloseModal}
          isOpenModal={isOpenModal}
          dismissible
          title={editMode ? "Editar Competencia" : "Nueva Competencia"}
          schema={ContestFormSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          formFields={<ContestFormFields isUpdate={editMode} />}
          saveLabel={editMode ? "Actualizar" : "Guardar"}
        />
      )}
      {modalNextStep && (
        <ModalViewer
          isOpenModal={modalNextStep}
          onCloseModal={() => {
            setModalNextStep(false), setContestToUpdateStep(null);
          }}
          title={
            <span>
              <HiOutlineSpeakerphone size={32} className="inline-block mr-2" />
              Publicar Competencia
            </span>
          }
        >
          <div className="w-full flex flex-col gap-4">
            <div>
              <img
                src={PublishImage}
                alt="Publicar Competencia"
                className="w-1/2 mx-auto"
              />
              <h3 className="text-2xl text-center font-semibold text-neutral-800">
                ¿Deseas publicar la competencia?
              </h3>
              <p className="text-center text-neutral-600 mb-4">
                Al publicar la competencia, esta será visible para los atletas y
                podrán inscribirse.
              </p>
              <div className="flex gap-4 p-2 rounded-md items-center text-white bg-crossfit-info/80">
                <i>
                  <MdInfo size={24} />
                </i>
                <p>
                  <strong>¡Atención! </strong>
                  Recuerda que una vez publicada, no podrás editar las
                  categorías o los wods de la competencia.
                </p>
              </div>
            </div>
            <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 gap-4">
              <ActionButtons
                extraActions={[
                  {
                    label: "Cancelar",
                    action: () => {
                      setContestNextStep(contestToUpdateStep.id);
                      setModalNextStep(false);
                    },
                    color: "neutral",
                    icon: TbArrowBackUp,
                    className: "min-w-full",
                  },
                  {
                    label: "Publicar",
                    action: handleContestNextStep,
                    color: "crossfit",
                    filled: true,
                    icon: HiOutlineSpeakerphone,
                    className: "min-w-full",
                  },
                ]}
              />
            </div>
          </div>
        </ModalViewer>
      )}
      {isOpenCancelSubscriptionModal && (
        <ModalViewer
        isOpenModal={isOpenCancelSubscriptionModal}
        onCloseModal={() => {
          setIsOpenCancelSubscriptionModal(false)
        }}
        title={
          <span>
            Cancelar subscripción
          </span>
        }
      >
        <div className="w-full flex flex-col gap-4">
          <div>
            <h3 className="text-2xl text-center font-semibold text-neutral-800">
              ¿Estás seguro de que deseas cancelar tu subscripción?
            </h3>
          </div>
          <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 gap-4">
            <ActionButtons
              extraActions={[
                {
                  label: "No, Cancelar",
                  action: () => {
                    setIsOpenCancelSubscriptionModal(false)
                    setRegisterId(null)
                  },
                  color: "neutral",
                  icon: CiCircleRemove ,
                  className: "min-w-full",
                },
                {
                  label: "Si, cancelar subscripción",
                  action: handleCancelSubscription,
                  color: "red",
                  filled: true,
                  icon: FaCheck,
                  className: "min-w-full",
                },
              ]}
            />
          </div>
        </div>
      </ModalViewer>
      )}
      {isOpenDeleteModal && (
        <ModalRemove
          isOpenModal={isOpenDeleteModal}
          onCloseModal={onCloseDeleteModal}
          removeFunction={onDeleteContest}
        />
      )}
    </div>
  );
};

const ProtectedContest = withPermission(Contest, "view_contest");

export default ProtectedContest;
