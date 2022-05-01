import React, { useEffect, useState } from 'react';
import Fade from '@mui/material/Fade';
import Divider from '@mui/material/Divider';
import "./learn-more.scss";

export default function LearnMore() {

  // Functions to get the headers from the page
  const getNestedHeadings = (headingElements) => {
    const nestedHeadings = [];

    headingElements.forEach((heading, index) => {
      const { innerText: title, id } = heading;

      if (heading.nodeName === "H2") {
        nestedHeadings.push({ id, title, items: [] });
      } else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
        nestedHeadings[nestedHeadings.length - 1].items.push({
          id,
          title,
        });
      }
    });

    return nestedHeadings;
  };
  const useHeadingsData = () => {
    const [nestedHeadings, setNestedHeadings] = useState([]);

    useEffect(() => {
      const headingElements = Array.from(
        document.querySelectorAll("h2, h3")
      );

      const newNestedHeadings = getNestedHeadings(headingElements);
      setNestedHeadings(newNestedHeadings);
    }, []);

    return { nestedHeadings };
  };

  // Table of contents component
  const Headings = ({ headings }) => (
    <ul className="lm-toc-list">
      {headings.map((heading) => (
        <li key={heading.id}>
          <span className="lm-list-item">
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(`#${heading.id}`).scrollIntoView({
                  behavior: "smooth"
                });
              }}
              className="lm-toc-link"
            >
              {heading.title}
            </a>
            {heading.items.length > 0 && (
              <ul className="lm-toc-list-2">
                {heading.items.map((child) => (
                  <li key={child.id}>
                    <span className="lm-list-item">
                      <a
                        href={`#${child.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelector(`#${child.id}`).scrollIntoView({
                            behavior: "smooth"
                          });
                        }}
                        className="lm-toc-link"
                      >
                        {child.title}
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
  const { nestedHeadings } = useHeadingsData();

  const fadeDuration = 300;
  const fadeOffset = 50;

  return (
    <>

      <div className="lm-wrapper">

        {/*Actual page */}
        <div className="lm-content">
          <div className="lm-text-wrapper">
            <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 0*fadeOffset+'ms' }}>
              <div>
                <p>
                  This is an introductory text to explain what the document is about.
                </p>
              </div>
            </Fade>

            <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 1*fadeOffset+'ms' }}>
              <div>
                <Divider textAlign="left"><h2 id="section-1" className="lm-header">Section 1</h2></Divider>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula risus, pellentesque id faucibus congue, tincidunt ut elit. Nam facilisis mollis mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In malesuada condimentum tellus quis venenatis. Cras in condimentum mauris. Ut eget justo condimentum, cursus orci scelerisque, mattis risus. Morbi elit tellus, placerat non enim nec, dapibus tempus enim. Pellentesque sapien orci, rutrum at rutrum quis, pellentesque eu augue. Praesent non diam augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
                </p>
              </div>
            </Fade>

            <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 2*fadeOffset+'ms' }}>
              <div>

                <Divider textAlign="left"><h2 id="section-2" className="lm-header">Section 2</h2></Divider>
                <p>
                  Duis et erat quam. Nullam eget ligula non tellus vulputate rhoncus. Quisque ut enim magna. Aliquam posuere vestibulum ipsum sed efficitur. In consectetur quam in leo congue eleifend. Phasellus id arcu a eros commodo commodo vel vel mauris. Sed enim ex, laoreet vel varius id, accumsan quis diam. Sed purus risus, scelerisque et ornare id, ultrices at magna. In eu quam vehicula, rhoncus velit sed, lacinia ipsum.
                </p>

                <h3 id="sub-section-1" className="lm-header">Sub-section 1</h3>
                <p>
                  Vestibulum posuere suscipit molestie. Nulla ultrices eros turpis, id congue augue auctor at. Ut sed eros in dolor vehicula suscipit tempus vitae enim. Donec sodales libero sit amet nunc vehicula aliquam. Quisque gravida orci a enim faucibus euismod. In at risus non nunc finibus ornare ut id nisi. Nullam dignissim nunc sit amet tellus interdum, ac rutrum tortor pellentesque. Aliquam imperdiet mauris ex, at venenatis nisi ultricies id. Donec non lacus dapibus, porta erat eget, molestie urna. Fusce semper ultrices molestie.
                </p>

                <h3 id="sub-section-2" className="lm-header">Sub-section 2</h3>
                <p>
                  Nulla facilisi. Aenean non iaculis ante. Donec tempus odio ut metus dictum, quis euismod metus sollicitudin. Nullam pellentesque nulla eu vehicula dictum. Nullam ligula elit, iaculis vel semper in, semper a magna. Quisque mattis felis in sodales finibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris fermentum mi sed accumsan dapibus. Duis fermentum tincidunt ante non pulvinar. Donec efficitur lectus nec sagittis ultricies.
                </p>

              </div>
            </Fade>

            <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 3*fadeOffset+'ms' }}>
              <div>
                <Divider textAlign="left"><h2 id="section-3" className="lm-header">Section 3</h2></Divider>
                <p>
                  Nam a sapien dui. Maecenas ac lacinia justo. Nam dapibus, purus a interdum consequat, libero ipsum consectetur odio, ut suscipit orci quam nec risus. Nullam a elit vel nisl facilisis aliquam sed vel sem. Fusce magna libero, mattis ac sapien et, ullamcorper efficitur metus. Aenean viverra tortor sed lorem tristique, vitae sagittis orci convallis. Pellentesque tristique mauris metus, ut posuere ex maximus vitae. In et interdum erat.
                </p>
              </div>
            </Fade>

            <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 4*fadeOffset+'ms' }}>
              <div>
                <Divider textAlign="left"><h2 id="section-4" className="lm-header">Section 4</h2></Divider>
                <p>
                  Maecenas pellentesque a leo a maximus. Quisque efficitur quis purus nec feugiat. Duis venenatis pulvinar feugiat. Cras vel ligula eros. Suspendisse ut est accumsan nunc rutrum placerat eu sagittis nulla. Morbi scelerisque blandit odio ultricies dignissim. Nam convallis sapien eget orci venenatis efficitur. Cras id suscipit mi. Nulla et ante ut erat suscipit placerat. Etiam porttitor nulla purus, at pulvinar dui semper vitae.
                </p>
              </div>
            </Fade>

            <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 5*fadeOffset+'ms' }}>
              <div>
                <Divider textAlign="left"><h2 id="section-5" className="lm-header">Section 5</h2></Divider>
                <p>
                  Sed vel dui felis. Sed eget tincidunt elit. Maecenas aliquet magna quis metus lobortis, et condimentum enim convallis. Cras vel est eu dolor placerat ultricies sed et est. Cras id nisl massa. Donec tempus ex nec malesuada consectetur. Proin a leo nec nisl rutrum ultrices quis eget turpis. Donec eu arcu convallis, feugiat urna placerat, sodales metus. Praesent nec ullamcorper augue, in fermentum tellus. Duis tellus nisl, egestas convallis ligula sit amet, molestie pellentesque ex.
                </p>
              </div>
            </Fade>

          </div>
        </div>

        {/* Table of contents (sticky) */}
        <Fade in={true} timeout={fadeDuration} style={{ transitionDelay: 0*fadeOffset+'ms' }}>
          <div className="lm-toc">
            <nav aria-label="Table of contents">
              <div className="lm-toc-title">Table of Contents</div>
              <Headings headings={nestedHeadings} />
            </nav>
          </div>
        </Fade>

      </div>

    </>
  )
}