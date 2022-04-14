import React, { useEffect, useState } from 'react';
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
        <ul className="learn-more-toc-list">
          {headings.map((heading) => (
            <li key={heading.id}> 
            <span className="learn-more-list-item">
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(`#${heading.id}`).scrollIntoView({
                    behavior: "smooth"
                  });
                }}
                className="tocLink"
              >
                {heading.title}
              </a>
              {heading.items.length > 0 && (
                <ul className="learn-more-toc-list-2">
                  {heading.items.map((child) => (
                    <li key={child.id}>
                    <span className="learn-more-list-item">
                      <a
                        href={`#${child.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelector(`#${child.id}`).scrollIntoView({
                            behavior: "smooth"
                          });
                        }}
                        className="tocLink"
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

    return (
        <>

        <p>
            This is an introductory text to explain what the document is about.
        </p>

        <div className="learn-more-toc-title">Table of Contents</div>
        <div className="learn-more-toc">
            <nav aria-label="Table of contents">
                <Headings headings={nestedHeadings} />
            </nav>
        </div>
        <br/>
         
        <div className="learn-more-text-wrapper">
           
            <h2 id="section-1" className="learn-more-header">Section 1</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula risus, pellentesque id faucibus congue, tincidunt ut elit. Nam facilisis mollis mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In malesuada condimentum tellus quis venenatis. Cras in condimentum mauris. Ut eget justo condimentum, cursus orci scelerisque, mattis risus. Morbi elit tellus, placerat non enim nec, dapibus tempus enim. Pellentesque sapien orci, rutrum at rutrum quis, pellentesque eu augue. Praesent non diam augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
            </p>
             
            <h2 id="section-2" className="learn-more-header">Section 2</h2>
            <p>
                Duis et erat quam. Nullam eget ligula non tellus vulputate rhoncus. Quisque ut enim magna. Aliquam posuere vestibulum ipsum sed efficitur. In consectetur quam in leo congue eleifend. Phasellus id arcu a eros commodo commodo vel vel mauris. Sed enim ex, laoreet vel varius id, accumsan quis diam. Sed purus risus, scelerisque et ornare id, ultrices at magna. In eu quam vehicula, rhoncus velit sed, lacinia ipsum.            
            </p>
             
            <h3 id="sub-section-1" className="learn-more-header">Sub-section 1</h3>
            <p>
                Vestibulum posuere suscipit molestie. Nulla ultrices eros turpis, id congue augue auctor at. Ut sed eros in dolor vehicula suscipit tempus vitae enim. Donec sodales libero sit amet nunc vehicula aliquam. Quisque gravida orci a enim faucibus euismod. In at risus non nunc finibus ornare ut id nisi. Nullam dignissim nunc sit amet tellus interdum, ac rutrum tortor pellentesque. Aliquam imperdiet mauris ex, at venenatis nisi ultricies id. Donec non lacus dapibus, porta erat eget, molestie urna. Fusce semper ultrices molestie.            
            </p>

            <h3 id="sub-section-2" className="learn-more-header">Sub-section 2</h3>
            <p>
                Nulla facilisi. Aenean non iaculis ante. Donec tempus odio ut metus dictum, quis euismod metus sollicitudin. Nullam pellentesque nulla eu vehicula dictum. Nullam ligula elit, iaculis vel semper in, semper a magna. Quisque mattis felis in sodales finibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris fermentum mi sed accumsan dapibus. Duis fermentum tincidunt ante non pulvinar. Donec efficitur lectus nec sagittis ultricies.
            </p>
             
            <h2 id="section-3" className="learn-more-header">Section 3</h2>
            <p>
                Nam a sapien dui. Maecenas ac lacinia justo. Nam dapibus, purus a interdum consequat, libero ipsum consectetur odio, ut suscipit orci quam nec risus. Nullam a elit vel nisl facilisis aliquam sed vel sem. Fusce magna libero, mattis ac sapien et, ullamcorper efficitur metus. Aenean viverra tortor sed lorem tristique, vitae sagittis orci convallis. Pellentesque tristique mauris metus, ut posuere ex maximus vitae. In et interdum erat.
            </p>

            <h2 id="section-4" className="learn-more-header">Section 4</h2>
            <p>
                Maecenas pellentesque a leo a maximus. Quisque efficitur quis purus nec feugiat. Duis venenatis pulvinar feugiat. Cras vel ligula eros. Suspendisse ut est accumsan nunc rutrum placerat eu sagittis nulla. Morbi scelerisque blandit odio ultricies dignissim. Nam convallis sapien eget orci venenatis efficitur. Cras id suscipit mi. Nulla et ante ut erat suscipit placerat. Etiam porttitor nulla purus, at pulvinar dui semper vitae.
            </p>

            <h2 id="section-5" className="learn-more-header">Section 5</h2>
            <p>
                Sed vel dui felis. Sed eget tincidunt elit. Maecenas aliquet magna quis metus lobortis, et condimentum enim convallis. Cras vel est eu dolor placerat ultricies sed et est. Cras id nisl massa. Donec tempus ex nec malesuada consectetur. Proin a leo nec nisl rutrum ultrices quis eget turpis. Donec eu arcu convallis, feugiat urna placerat, sodales metus. Praesent nec ullamcorper augue, in fermentum tellus. Duis tellus nisl, egestas convallis ligula sit amet, molestie pellentesque ex.
            </p>

        </div>
        </>
    )
}