import {
  FC,
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import { Modal } from "flowbite";
import Button from "../components/shared/buttons/button";
import { Col } from "../components/shared/layout/flex";
import Login from "../components/app/login/login";
import Signup from "../components/app/signup/signup";
import clsx from "clsx";

export const AuthModal = createContext({
  modalTrigger: { show: () => null, hide: () => null },
  setVisibleSection: (String: string) => null,
  hideModal: () => null,
});

const AuthModalProvider: FC<any> = (props: any) => {
  const [modalTrigger, setModalTrigger] = useState<any>();
  const [visibleSection, setVisibleSection] = useState<"login" | "signup">(
    "login"
  );

  useEffect(() => {
    const $targetEl = document.getElementById("authentication-modal");

    const options: any = {
      placement: "center",
      backdrop: "static",
      closable: true,
    };
    const modal = new Modal($targetEl, options);
    setModalTrigger(modal);
  }, []);
  const hideModal = useCallback(() => modalTrigger.hide(), [modalTrigger]);

  const contextValue: any = { modalTrigger, setVisibleSection, hideModal };

  return (
    <AuthModal.Provider value={contextValue}>
      <Col
        id="authentication-modal"
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <Col className={clsx({ "max-w-6xl": visibleSection === 'signup', "max-w-md": visibleSection !== 'signup' }, "relative w-full max-h-full")}>
          <Col className="relative rounded-lg shadow bg-gray-700 pt-5 pb-5">
            <Col className="gap-4 min-h-[550px]">
              <Button
                className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white me-8"
                data-modal-hide="staticModal"
                onClick={() => modalTrigger.hide()}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
              {visibleSection === "login" ? (
                <Login changeSection={setVisibleSection} />
              ) : (
                <Signup changeSection={setVisibleSection} />
              )}
            </Col>
          </Col>
        </Col>
      </Col>

      {props.children}
    </AuthModal.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModal);

export default AuthModalProvider;
