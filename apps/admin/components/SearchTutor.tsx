"use client";

import { getTutorById } from "@/data/tutor";
import { Tutor } from "@igraph/database";
import { useEffect, useState } from "react";
import SearchField from "./forms/SearchField";
import { searchTutors } from "@/data/search";

const SearchTutors = ({
  field,
  tutorId,
  placeHolder = "Search Tutors...",
}: {
  field: any;
  tutorId?: number;
  placeHolder?: string;
}) => {
  const [defaultUser, setDefaultUser] = useState<Tutor | undefined>(undefined);

  const fetchTutors = async (query: string): Promise<Tutor[]> => {
    return await searchTutors(query);
  };

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (tutorId) {
        const user = await getTutorById(tutorId);
        setDefaultUser(user ? user : undefined);
      }
    };

    fetchSelectedUser();
  }, [tutorId]);

  return (
    <SearchField<Tutor>
      placeholder={placeHolder}
      fetchResults={fetchTutors}
      onSelect={(tutor) =>
        tutor ? field.onChange(tutor.id) : field.onChange(undefined)
      }
      getItemLabel={(tutor) => `${tutor.name} - ${tutor.email.toLowerCase()}`}
      defaultItem={defaultUser}
    />
  );
};

export default SearchTutors;
