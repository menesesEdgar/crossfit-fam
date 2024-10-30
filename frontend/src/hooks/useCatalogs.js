import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers as getAthletes,
  getUser as getAthlete,
  createUser as createAthlete,
  updateUser as updateAthlete,
  deleteUser as deleteAthlete,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getWods,
  getWod,
  createWod,
  updateWod,
  deleteWod,
  createContest,
  updateContest,
  deleteContest,
  getContests,
} from "../services/api";
import { useLoading } from "../context/LoadingContext";
import Notifies from "../components/Notifies/Notifies";

const useCatalogs = (dispatch) => {
  const queryClient = useQueryClient();
  const { dispatch: loadingDispatch } = useLoading();

  const setLoading = (loading) => {
    loadingDispatch({ type: "SET_LOADING", payload: loading });
  };

  const fetchAthletes = useMutation({
    mutationFn: getAthletes,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: "FETCH_ATHLETES", payload: data });
    },
    onSettled: () => setLoading(false),
  });

  const fetchAthlete = useMutation({
    mutationFn: getAthlete,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: "FETCH_ATHLETE", payload: data });
    },
    onSettled: () => setLoading(false),
  });

  const createAthleteMutation = useMutation({
    mutationFn: createAthlete,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries("athletes");
      dispatch({ type: "CREATE_ATHLETE", payload: data });
      Notifies("success", "Atleta registrado exitosamente");
      return data;
    },
    onError: (error) => {
      Notifies("error", "Error al registrar atleta");
    },
    onSettled: () => setLoading(false),
  });

  const updateAthleteMutation = useMutation({
    mutationFn: updateAthlete,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries("athletes");
      dispatch({ type: "UPDATE_ATHLETE", payload: data });
      Notifies("success", "Atleta actualizado exitosamente");
      return data;
    },
    onError: (error) => {
      Notifies("error", "Error al actualizar el atleta");
    },
    onSettled: () => setLoading(false),
  });

  const deleteAthleteMutation = useMutation({
    mutationFn: deleteAthlete,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries("athletes");
      dispatch({ type: "DELETE_ATHLETE", payload: data.data });
      Notifies("success", "Atleta eliminado exitosamente");
    },
    onError: (error) => {
      Notifies("error", "Error al eliminar el atleta");
    },
    onSettled: () => setLoading(false),
  });

  const fetchCategories = useMutation({
    mutationFn: getCategories,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: "FETCH_CATEGORIES", payload: data });
    },
    onSettled: () => setLoading(false),
  });

  const fetchCategory = useMutation({
    mutationFn: getCategory,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: "FETCH_CATEGORIE", payload: data });
    },
    onSettled: () => setLoading(false),
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries("categories");
      dispatch({ type: "CREATE_CATEGORY", payload: data });
      Notifies("success", "Categoría creada exitosamente");
    },
    onError: (error) => {
      Notifies("error", "Error al crear la categoría");
    },
    onSettled: () => setLoading(false),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries("categories");
      dispatch({ type: "UPDATE_CATEGORY", payload: data });
      Notifies("success", "Categoría actualizada exitosamente");
    },
    onError: (error) => {
      Notifies("error", "Error al actualizar la categoría");
    },
    onSettled: () => setLoading(false),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries("categories");
      dispatch({ type: "DELETE_CATEGORY", payload: data.data });
      Notifies("success", "Categoría eliminada exitosamente");
    },
    onError: (error) => {
      Notifies("error", "Error al eliminar la categoría");
    },
    onSettled: () => setLoading(false),
  });

  const fetchWods = useMutation({
    mutationFn: getWods,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: "FETCH_WODS", payload: data });
    },
    onSettled: () => setLoading(false),
  });

  const fetchWod = useMutation({
    mutationFn: getWod,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: "FETCH_WOD", payload: data });
    },
    onSettled: () => setLoading(false),
  });

  const createWodMutation = useMutation({
    mutationFn: createWod,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries("wods");
      dispatch({ type: "CREATE_WOD", payload: data });
      Notifies("success", "Wod creado exitosamente");
    },
    onError: (error) => {
      Notifies("error", "Error al crear Wod");
    },
    onSettled: () => setLoading(false),
  });

  const updateWodMutation = useMutation({
    mutationFn: updateWod,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries("wods");
      console.log(data);
      dispatch({ type: "UPDATE_WOD", payload: data });
      Notifies("success", "Wod actualizado exitosamente");
    },
    onError: (error) => {
      Notifies("error", "Error al actualizar el wod");
    },
    onSettled: () => setLoading(false),
  });

  const deleteWodMutation = useMutation({
    mutationFn: deleteWod,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      queryClient.invalidateQueries("wods");
      dispatch({ type: "DELETE_WOD", payload: data.data });
      Notifies("success", "Wod eliminado exitosamente");
    },
    onError: (error) => {
      Notifies("error", "Error al eliminar el wod");
    },
    onSettled: () => setLoading(false),
  });
  // Contests
  const fetchContests = useMutation({
    mutationFn: getContests,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      dispatch({ type: "FETCH_CONTESTS", payload: data });
    },
    onSettled: () => setLoading(false),
  });
  const useCreateContest = useMutation({
    mutationFn: createContest,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: "CREATE_CONTEST", payload: data });
      Notifies("success", "Competencia creada correctamente");
    },
    onError: (error) => {
      console.log("error on createContest", error);
      Notifies("error", error?.response?.data?.message);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries("contests");
      setLoading(false);
    },
  });

  const useUpdateContest = useMutation({
    mutationFn: updateContest,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: "UPDATE_CONTEST", payload: data });
      Notifies("success", "Competencia actualizada correctamente");
    },
    onError: (error) => {
      console.log("error on updateContest", error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries("contests");
      setLoading(false);
    },
  });

  const useDeleteContest = useMutation({
    mutationFn: deleteContest,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      dispatch({ type: "DELETE_CONTEST", payload: data });
      Notifies("success", "Competencia eliminada correctamente");
    },
    onError: (error) => {
      console.log("error on deleteContest", error);
      setLoading(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries("contests");
      setLoading(false);
    },
  });
  return {
    fetchContests: fetchContests.mutate,
    createContest: (values) => {
      return useCreateContest.mutateAsync(values);
    },
    updateContest: (values) => {
      return useUpdateContest.mutateAsync(values);
    },
    deleteContest: (values) => {
      return useDeleteContest.mutateAsync(values);
    },
    fetchAthletes: fetchAthletes.mutate,
    fetchAthlete: fetchAthlete.mutate,
    createAthlete: (values) => {
      return createAthleteMutation.mutateAsync(values);
    },
    updateAthlete: (values) => {
      return updateAthleteMutation.mutateAsync(values);
    },
    deleteAthlete: deleteAthleteMutation.mutate,
    fetchCategories: fetchCategories.mutate,
    fetchCategory: fetchCategory.mutate,
    createCategory: (values) => {
      return createCategoryMutation.mutateAsync(values);
    },
    updateCategory: (values) => {
      return updateCategoryMutation.mutateAsync(values);
    },
    deleteCategory: deleteCategoryMutation.mutate,
    fetchWods: fetchWods.mutate,
    fetchWod: fetchWod.mutate,
    createWod: (values) => {
      return createWodMutation.mutateAsync(values);
    },
    updateWod: (values) => {
      return updateWodMutation.mutateAsync(values);
    },
    deleteWod: deleteWodMutation.mutate,
  };
};

export default useCatalogs;
