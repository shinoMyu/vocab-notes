import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Vocabulary from "./pages/Vocabulary";
import Grammar from "./pages/Grammar";
import GrammarNoteRoute from "./pages/Grammar/NotePage";
import Programming from "./pages/Programming";
import ProgrammingNoteRoute from "./pages/Programming/NotePage";
import GeneralNotes from "./pages/GeneralNotes";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="vocabulary/english" element={<Vocabulary />} />
        <Route path="vocabulary/japanese" element={<Vocabulary />} />
        <Route path="grammar" element={<Grammar />} />
        <Route path="grammar/:noteId" element={<GrammarNoteRoute />} />
        <Route path="programming" element={<Programming />} />
        <Route path="programming/:noteId" element={<ProgrammingNoteRoute />} />
        <Route path="notes" element={<GeneralNotes />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;