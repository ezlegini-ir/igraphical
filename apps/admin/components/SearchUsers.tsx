"use client";

import { User } from "@igraph/database";
import { useEffect, useState } from "react";
import SearchField from "@igraph/ui/components/SearchField";
import { searchUsers } from "@/data/search";
import { getUserById } from "@/data/user";

const SearchUsers = ({
  field,
  userId,
  placeHolder = "Search Users...",
}: {
  field: any;
  userId?: number;
  placeHolder?: string;
}) => {
  const [defaultUser, setDefaultUser] = useState<User | undefined>(undefined);

  const fetchUsers = async (query: string): Promise<User[]> => {
    return await searchUsers(query);
  };

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (userId) {
        const user = await getUserById(userId);
        setDefaultUser(user || undefined);
      }
    };
    fetchSelectedUser();
  }, [userId]);

  return (
    <SearchField<User>
      placeholder={placeHolder}
      fetchResults={fetchUsers}
      onSelect={(user) =>
        user ? field.onChange(user.id) : field.onChange(undefined)
      }
      getItemLabel={(user) => `${user.fullName} - ${user.email.toLowerCase()}`}
      defaultItem={defaultUser}
    />
  );
};

export default SearchUsers;
