import { ReactChatbot } from "@vectara/react-chatbot";
import "./vectara.css";

const Vectara = () => (
  <div className="chatbot-container1">
    <ReactChatbot
      customerId="3908346309"
      corpusKeys="corpuspdpsipa"
      apiKey="zwt_6PShxTV6GRg0oIBLggy_HlO9FSOAaP3HHntKdQ"
      title="Sintesa"
      placeholder='ketik pertanyaan disini coy..."'
      exampleQuestions={["cara akses sintesa?", "formula ikpa apa ya?"]}
      inputSize="small"
      ux="summary"
      // enableFactualConsistencyScore={true}
      // enableStreaming={true}
      // numberOfSearchResultsForSummary={10}
      // language="ind"
      // rerankerId={272725718}
      // summary_fcs_mode="score"
      // lambda={0.005}
      // isInitiallyOpen={true}
      // enable_source_filters={false}
      // all_sources={false}
      // zIndex={1}
    />
  </div>
);
export default Vectara;
