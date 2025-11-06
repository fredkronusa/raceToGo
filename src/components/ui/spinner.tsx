import { Loader } from "lucide-react";
import React from "react";

// TODO: create story for Spinner, allow size variants

const Spinner = () => (
  <Loader className="animate-spin text-primary absolute top-1/2 left-auto right-auto w-full" />
);

export { Spinner };
