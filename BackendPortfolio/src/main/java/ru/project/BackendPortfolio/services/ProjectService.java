package ru.project.BackendPortfolio.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.CardDTO;
import ru.project.BackendPortfolio.dto.ProjectDTO;
import ru.project.BackendPortfolio.exceptions.ForbiddenException;
import ru.project.BackendPortfolio.models.Folder;
import ru.project.BackendPortfolio.models.Project;
import ru.project.BackendPortfolio.models.ProjectFile;
import ru.project.BackendPortfolio.repositories.ProjectRepository;
import ru.project.BackendPortfolio.repositories.TeamRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final ModelMapper modelMapper;
    private final ProjectRepository projectRepository;
    private final FileStorageService fileStorageService;
    private final PersonService personService;
    private final ProjectLinkService projectLinkService;
    private final TeamRepository teamRepository;

    @Autowired
    public ProjectService(ModelMapper modelMapper, ProjectRepository projectRepository,
                          FileStorageService fileStorageService, PersonService personService,
                          ProjectLinkService projectLinkService, TeamRepository teamRepository) {
        this.modelMapper = modelMapper;
        this.projectRepository = projectRepository;
        this.fileStorageService = fileStorageService;
        this.personService = personService;
        this.projectLinkService = projectLinkService;
        this.teamRepository = teamRepository;
    }

    @Transactional
    public ProjectDTO createByPerson(ProjectDTO projectDTO){
        var project = new Project();
        var person = personService.getActivePerson();
        project.setOwner(person);
        return create(projectDTO, project);
    }

    @Transactional
    public ProjectDTO createByTeam(ProjectDTO projectDTO){
        var project = new Project();
        var teamId = projectDTO.getTeamId();
        var team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Команда не найдена"));
        project.setTeam(team);
        return create(projectDTO, project);
    }

    @Transactional
    public ProjectDTO create(ProjectDTO projectDTO, Project project) {
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());

        // Токен
        var token = UUID.randomUUID().toString();
        project.setShareToken(token);
        project.setPublic(true);

        if (projectDTO.getImageFile() != null) {
            var fileName = fileStorageService.save(projectDTO.getImageFile());
            project.setImageName(fileName);
        }

        project = projectRepository.save(project);

        var newProjectLinks = projectDTO.getProjectLinks();
        if (newProjectLinks != null) {
            for (var newProjectLink : newProjectLinks) {
                projectLinkService.create(newProjectLink, project);
            }
        }

        if (projectDTO.getFolders() != null) {
            createFolders(projectDTO, project);
        }

        var result = projectRepository.save(project);

        return mapToDTO(result);
    }


    @Transactional
    public Project createProject(ProjectDTO projectDTO) {

        var project = new Project();
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());

        // Задаём пользователя
        var person = personService.getActivePerson();
        project.setOwner(person);

        // Токен
        var token = UUID.randomUUID().toString();
        project.setShareToken(token);
        project.setPublic(true);

        if (projectDTO.getImageFile() != null) {
            var fileName = fileStorageService.save(projectDTO.getImageFile());
            project.setImageName(fileName);
        }

        project = projectRepository.save(project);

        var newProjectLinks = projectDTO.getProjectLinks();
        if (newProjectLinks != null) {
            for (var newProjectLink : newProjectLinks) {
                projectLinkService.create(newProjectLink, project);
            }
        }

        if (projectDTO.getFolders() != null) {
            createFolders(projectDTO, project);
        }

        return projectRepository.save(project);
    }

    public List<ProjectDTO> getAllProjectsByTeam(int id){
        var projects = projectRepository.findByTeamId(id);
        List<ProjectDTO> projectDTOs = new ArrayList<>();
        for (var project : projects) {
            projectDTOs.add(mapToDTO(project));
        }
        return projectDTOs;
    }

    @Transactional
    public void deleteProject(int projectId) {
        var person = personService.getActivePerson();
        var project = getProjectById(projectId);

        if (!project.getOwner().equals(person)) {
            throw new ForbiddenException("Вы не можете удалить этот проект, так как он вам не принадлежит.");
        }

        projectRepository.delete(project);
    }

    @Transactional
    public Project updateProject(int projectId, ProjectDTO projectDTO) {
//        var person = personService.getActivePerson();
        var project = getProjectById(projectId);

//        if (!project.getOwner().equals(person)) {
//            throw new ForbiddenException("Вы не можете редактировать этот проект, так как он вам не принадлежит.");
//        }

        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());

        if (projectDTO.getImageFile() != null) {
            var fileName = fileStorageService.save(projectDTO.getImageFile());
            project.setImageName(fileName);
        }

        project.getProjectLinks().clear();
        project.getFolders().clear();

        // Добавление новых ссылок
        var newProjectLinks = projectDTO.getProjectLinks();
        if (newProjectLinks != null) {
            for (var newLink : newProjectLinks) {
                projectLinkService.create(newLink, project);
            }
        }

        // Добавление новых папок и файлов
        if (projectDTO.getFolders() != null) {
            createFolders(projectDTO, project);
        }

        return projectRepository.save(project);
    }

    @Transactional
    public void createFolders(ProjectDTO projectDTO, Project project){
        for (var folderDTO : projectDTO.getFolders()) {
            var folder = new Folder();
            folder.setTitle(folderDTO.getTitle());
            folder.setProject(project);
            List<ProjectFile> files = new ArrayList<>();
            if (folderDTO.getFiles() != null) {
                for (var fileDTO : folderDTO.getFiles()) {
                    var file = new ProjectFile();
                    file.setDescription(fileDTO.getDescription());

                    if (fileDTO.getFile() == null) {
                        throw new RuntimeException("ERROR1");
                    }
                    var fileName = fileStorageService.save(fileDTO.getFile());
                    if (fileName == null) {
                        throw new RuntimeException("ERROR2");
                    }

                    file.setFileTitle(fileName);
                    file.setFolder(folder);
                    files.add(file);
                }
            }
            folder.setFiles(files);
            if (project.getFolders() == null){
                project.setFolders(new ArrayList<>());
            }
            project.getFolders().add(folder);
        }
    }

    public ProjectDTO getProjectDTOById(int id){
        var project = getProjectById(id);
        return mapToDTO(project);
    }

    public List<ProjectDTO> getProjectsByUser() {
        var person = personService.getActivePerson();
        var projects = projectRepository.findByOwner(person);
        List<ProjectDTO> projectDTOs = new ArrayList<>();
        for (var project : projects) {
            var projectDTO = mapToDTO(project);
            projectDTOs.add(projectDTO);
        }
        return projectDTOs;
    }

    public ProjectDTO mapToDTO(Project project) {
        return modelMapper.map(project, ProjectDTO.class);
    }

    public Project getProjectById(int projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Проект не найден"));
    }
}