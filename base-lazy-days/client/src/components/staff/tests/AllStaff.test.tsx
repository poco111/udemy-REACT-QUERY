import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

// import { rest } from 'msw';
// import { defaultQueryClientOptions } from '../../../react-query/queryClient';
// import { server } from '../../../mocks/server';
// import { renderWithClient } from '../../../test-utils';
import { AllStaff } from "../AllStaff";

test("renders response from query", () => {
  // write test here
});

test("handles query error", async () => {
  // (re)set handler to return a 500 error for staff
  // server.resetHandlers(
  //   http.get('http://localhost:3030/staff', (req, res, ctx) => {
  //     return HttpResponse(null, { status: 500 });
  //   }),
  // );
});
