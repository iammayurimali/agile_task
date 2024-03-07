import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { getAllDevelopers } from "../GraphQl/Query";
import {ASSIGNPROJECT} from "../GraphQl/Mutation"
import {useState} from "react"
import toast from "react-hot-toast";

//import {GET_DEVELOPERS} from "../GraphQl/Query"

export default function AssignProject() {
  const { loading, error, data, refetch } = useQuery(getAllDevelopers);

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState("");

  const [assignproject,{ loading: mutationLoading, error: mutationError }] = useMutation(ASSIGNPROJECT, {
    onCompleted: () => {
      refetch();
    },
  });


  if (loading) return <p>loading</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  function assignProjectHandler(e) {
    e.preventDefault();
    if (selectedProject && selectedDeveloper) {
      assignproject({
        variables: {
          developerId: selectedDeveloper,
          assignedproject: selectedProject,
        },
      })
     //console.log("Selected Data:",selectedDeveloper,selectedProject)
        .then((response) => {
          console.log("AssignProject response:", response);
          toast.success("Project Assigned Successfully")
        })
        .catch((error) => {
          console.error("Mutation error:", error);
          toast.error("Project Already Assigned")
        });
    } else {
      console.log("Please select both project and developer");
    }
  }
  return (
    <div>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Assign Project
          </h2>
        </div>
        <div className="flex justify-center items-start">
          <div className="w-full max-w-md">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Project Assign Form
                </h3>
              </div>
              <form action="#">
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Project
                    </label>
                    <div
                      x-data="{ isOptionSelected: false }"
                      className="relative z-20 bg-transparent dark:bg-form-input"
                    >
                      <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                       className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                        <option  className="text-body">
                          Select Project
                        </option>
                        <option value="RH" className="text-body">
                          RH
                        </option>
                        <option value="Project A" className="text-body">
                          Project A
                        </option>
                        <option value="Project B" className="text-body">
                          Project B
                        </option>
                      </select>
                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                              fill=""
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Developer
                    </label>
                    <div
                      x-data="{ isOptionSelected: false }"
                      className="relative z-20 bg-transparent dark:bg-form-input"
                    >
                      <select 
                      value={selectedDeveloper}
                      onChange={(e) => setSelectedDeveloper(e.target.value)}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                         <option  className="text-body">
                          Select Developer
                        </option>
                        {data?.getAllDevelopers?.map((developer) => (
                          <option
                            key={developer.id}
                            value={developer.id}
                            className="text-body"
                          >
                            {developer.firstname} {developer.lastname}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                              fill=""
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <button
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    onClick={assignProjectHandler}
                  >
                   {mutationLoading ? "Submitting..." : "Submit"}
                  </button>
                  {mutationError && <p>Error: {mutationError.message}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}