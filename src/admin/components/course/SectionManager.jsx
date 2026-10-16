import { useState } from "react";
import LessonManager from "./LessonManager";


export default function SectionManager({
  course,
  setCourse,
}) {

  const [sectionTitle, setSectionTitle] = useState("");



  const addSection = () => {

    if (!sectionTitle.trim()) {
      alert("Please enter module name.");
      return;
    }


    const newSection = {

      id: crypto.randomUUID(),

      title: sectionTitle.trim(),

      lessons: [],

    };



    setCourse((previous) => ({

      ...previous,

      sections: [
        ...previous.sections,
        newSection,
      ],

    }));


    setSectionTitle("");

  };





  const deleteSection = (sectionId) => {


    setCourse((previous) => ({

      ...previous,

      sections:
        previous.sections.filter(
          (section) =>
            section.id !== sectionId
        ),

    }));

  };





  const moveSection = (
    index,
    direction
  ) => {


    const sections = [
      ...course.sections
    ];


    const newIndex =
      index + direction;



    if (
      newIndex < 0 ||
      newIndex >= sections.length
    ) {
      return;
    }



    [
      sections[index],
      sections[newIndex],
    ] = [

      sections[newIndex],
      sections[index],

    ];



    setCourse((previous) => ({

      ...previous,

      sections,

    }));

  };





  const updateSection = (
    updatedSection
  ) => {


    setCourse((previous) => ({

      ...previous,

      sections:
        previous.sections.map(
          (section) =>
            section.id === updatedSection.id
              ? updatedSection
              : section
        ),

    }));

  };





  return (

    <div className="mt-10">


      <h3 className="text-2xl font-bold mb-6">
        Course Modules
      </h3>




      {/* Add Module */}


      <div className="flex gap-3 mb-8">


        <input

          type="text"

          value={sectionTitle}

          onChange={(e) =>
            setSectionTitle(
              e.target.value
            )
          }

          placeholder="Module name..."

          className="flex-1 border rounded-lg p-3"

        />



        <button

          type="button"

          onClick={addSection}

          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"

        >

          + Add Module

        </button>


      </div>





      {/* Empty */}


      {course.sections.length === 0 && (

        <div className="border border-dashed rounded-xl p-8 text-center text-gray-500">

          No modules created yet.

        </div>

      )}






      {/* Modules */}



      <div className="space-y-6">


        {course.sections.map(
          (section,index)=>(


          <div

            key={section.id}

            className="border rounded-xl p-6 bg-gray-50"

          >



            <div className="flex justify-between items-center mb-5">



              <div>


                <h4 className="text-xl font-bold">

                  Module {index + 1}

                </h4>


                <p className="text-gray-600">

                  {section.title}

                </p>


              </div>





              <div className="flex gap-2">


                <button

                  type="button"

                  onClick={() =>
                    moveSection(
                      index,
                      -1
                    )
                  }

                  className="bg-gray-200 px-3 py-2 rounded-lg"

                >

                  ↑

                </button>



                <button

                  type="button"

                  onClick={() =>
                    moveSection(
                      index,
                      1
                    )
                  }

                  className="bg-gray-200 px-3 py-2 rounded-lg"

                >

                  ↓

                </button>



                <button

                  type="button"

                  onClick={() =>
                    deleteSection(
                      section.id
                    )
                  }

                  className="bg-red-600 text-white px-4 py-2 rounded-lg"

                >

                  Delete

                </button>



              </div>



            </div>





            {/* Lessons */}


            <LessonManager

              section={section}

              updateSection={
                updateSection
              }

            />



          </div>


        ))}


      </div>


    </div>

  );

}